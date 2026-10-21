
import React, { useEffect, useState } from 'react';

interface Review {
  image: string;
  name: string;
  location: string;
  star: number;
  testimonial: string;
}

interface TestimonialProps {
  reviews: Review[];
}

const Testimonial: React.FC<TestimonialProps> = ({ reviews }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  const slidePerView = windowWidth > 760 ? 3 : 1;
  const timeInterval = 5000;
  const maxSlide = Math.max(0, reviews.length - slidePerView);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  setCurrentSlide((current) => Math.min(current, maxSlide));
}, [maxSlide]);

  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide <= 0 ? maxSlide : Math.max(0, prevSlide - slidePerView)
    );
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide >= maxSlide
        ? 0
        : Math.min(maxSlide, prevSlide + slidePerView)
    );
  };

  useEffect(() => {
    if (maxSlide === 0) return;

    const interval = window.setTimeout(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide >= maxSlide
          ? 0
          : Math.min(maxSlide, prevSlide + slidePerView)
      );
    }, timeInterval);

    return () => window.clearTimeout(interval);
  }, [currentSlide, maxSlide, slidePerView]);

  const safeCurrentSlide = Math.min(currentSlide, maxSlide);

  const slideStyle = {
    transform: `translateX(-${(safeCurrentSlide * 100) / slidePerView}%)`,
  };

  return (
    <section className="max-w-[85%] mx-auto h-[90vh] grid place-content-center">
      <h1 className="text-2xl lg:text-4xl text-center font-bold mb-10">
        What <span className="text-primaryColor">Our Customers Say</span> About Us
      </h1>

      <div className="relative overflow-hidden">
        <div className="absolute w-[100%] flex justify-between top-[50%] translate-y-[-50%] z-[30]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonials"
            className="slide-btn transition-opacity duration-500 ease-in-out border-[2px] border-dashed rounded-full border-secondaryColor w-[50px] h-[50px] opacity-20 grid place-content-center"
          >
            <img
              src="https://cdn.hugeicons.com/icons/arrow-left-01-stroke-rounded.svg"
              alt=""
              width="24"
              height="24"
            />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonials"
            className="slide-btn transition-opacity duration-500 ease-in-out border-[2px] border-dashed rounded-full border-secondaryColor w-[50px] h-[50px] opacity-20 grid place-content-center"
          >
            <img
              src="https://cdn.hugeicons.com/icons/arrow-right-01-stroke-rounded.svg"
              alt=""
              width="24"
              height="24"
            />
          </button>
        </div>

        <div
          className="flex flex-row items-center gap-2 transition-transform duration-700 ease-in-out w-full p-1"
          style={slideStyle}
        >
          {reviews.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="custom-shadow flex-shrink-[1] flex-grow-[1] basis-[100%] md:basis-[50%] lg:basis-[24.5%] min-w-[100%] md:min-w-[50%] lg:min-w-[32.8%] rounded-lg h-[350px] p-5"
            >
              <div className="flex gap-[30px]">
                <div className="w-[80px] h-[80px] rounded-full">
                  <img
                    src={review.image}
                    alt={`${review.name} image`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <h5>{review.name}</h5>
                  <p className="text-[10px] italic text-primaryColor font-bold">
                    {review.location}
                  </p>
                </div>
              </div>

              <p className="text-[12px] mt-5">{review.testimonial}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
