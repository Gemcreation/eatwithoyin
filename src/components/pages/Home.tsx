import React from "react"

// component
import Hero from "../sections/home/Hero"
import Whychooseus from "../sections/home/Whychooseus"
import Testimonial from "../sections/home/Testimonial"
import About from "../sections/home/About"

// assets-images
import Rice from '../../assets/images/item-rice.png'
// import Rice from '../../assets/images/oyin-rice.png' check if this is the correct image to use for the hero section
import OyinPlace from '../../assets/images/Oyin-place.png'

const Home: React.FC = () => {
  const reasons = [
    {
      image: {
        // src: Place,
        src: 'https://cdn.hugeicons.com/icons/flower-pot-stroke-rounded.svg',
        alt: "Oyin place"
      },
      subtitle: 'Comfortable enviroment',
      paragraph: 'At our establishment, we are dedicated to creating a welcoming and inclusive atmosphere for all individuals. Our goal is to provide you with an experience that goes beyond simply enjoying our delicious delights.'
    },
    {
      image: {
        src: 'https://cdn.hugeicons.com/icons/laptop-phone-sync-stroke-rounded.svg',
        alt: "ease-curve-control-points"
      },
      subtitle: 'Ordering is a simple process',
      paragraph: 'You can conveniently order food with just one click, selecting from a wide range of options available at any time and in the comfort of your own home.'
    },
    {
      image: {
        src: 'https://cdn.hugeicons.com/icons/motorbike-02-stroke-rounded.svg',
        alt: "delivery-delay-02"
      },
      subtitle: 'Swift & Reliable Delivery',
      paragraph: 'Enjoy your favorite meals delivered fresh, safely, and right on time to your preferred location whenever you need them.'
    },
    {
      image: {
        src: 'https://cdn.hugeicons.com/icons/tongue-01-stroke-rounded.svg',
        alt: "plate"
      },
      subtitle: 'Irresistible Taste',
      paragraph: 'Enjoy delicious, freshly prepared meals made with quality ingredients and rich flavors that keep you coming back for more.'
    },
    {
      image: {
        src: 'https://cdn.hugeicons.com/icons/slideshare-stroke-rounded.svg',
        alt: "sponsor"
      },
      subtitle: 'Event Sponsorship',
      paragraph: 'We’re proud to support events and initiatives that bring people together and make a positive impact. Let us be part of your next event by providing quality meals and meaningful support.'
    },
    {
      image: {
        src: 'https://cdn.hugeicons.com/icons/customer-service-stroke-rounded.svg',
        alt: "plate"
      },
      subtitle: 'Customer Service',
      paragraph: 'Our dedicated team is available to help address any questions or issues you may have. We are committed to ensuring that your interaction with us is smooth and pleasant.'
    },
  ]

  const reviews = [
    {
      image: 'https://img.freepik.com/free-photo/smiling-millennial-man-looking-camera-cafe-headshot-portrait_1163-5163.jpg?size=626&ext=jpg&uid=R106669124&ga=GA1.1.1904170439.1707861205&semt=ais',
      name: 'Shakir Bili',
      location: 'Lagos, Nigeria',
      star: 5,
      testimonial: `I was particularly impressed by the Jollof Rice, which was a perfect blend of spices and flavors. The restaurant's modern decor and attentive staff add to the overall charm. With reasonable prices and exceptional food, Eat With Oyin is a must-visit destination for food enthusiasts.`
    },
    {
      image: 'https://img.freepik.com/free-photo/side-view-businessman-working-office_23-2148242722.jpg?size=626&ext=jpg&uid=R106669124&ga=GA1.1.1904170439.1707861205&semt=ais',
      name: 'Jeffery Benson',
      location: 'NY, USA',
      star: 5,
      testimonial: 'I recently had the pleasure of dining at Item7 Take-out Restaurant, and I must say, it was an exceptional experience. From the moment I stepped in, I was greeted with a warm and inviting atmosphere. The staff was incredibly friendly and attentive, making sure that my dining experience was nothing short of perfect.'
    },
    {
      image: 'https://img.freepik.com/free-psd/expressive-woman-gesturing_23-2150198673.jpg?size=626&ext=jpg&uid=R106669124&ga=GA1.1.1904170439.1707861205&semt=ais',
      name: 'Anita Casanada',
      location: 'WA, USA',
      star: 4,
      testimonial: 'The restaurant is clean and well-maintained, with a modern aesthetic. Prices are reasonable for the quality of food and service. Overall, Item7 is a must-visit for anyone looking for a delightful dining experience.'
    },
    {
      image: 'https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=626&ext=jpg&uid=R106669124&ga=GA1.1.1904170439.1707861205&semt=ais',
      name: 'Idris Hammed',
      location: 'LA, USA',
      star: 4.5,
      testimonial: 'The menu offers a variety of delicious options, from traditional favorites to unique creations. I especially enjoyed the Jollof Rice, which was flavorful and perfectly cooked. The restaurant is clean and well-maintained, and the prices are reasonable.'
    },
    {
      image: 'https://img.freepik.com/free-photo/selfie-portrait-videocall_23-2149186124.jpg?size=626&ext=jpg&uid=R106669124&ga=GA1.1.1904170439.1707861205&semt=ais',
      name: 'Oliva Mary',
      location: 'NY, USA',
      star: 5,
      testimonial: 'I recently had the pleasure of dining at Eat With Oyin Take-out Restaurant, and I must say, it was an exceptional experience. From the moment I stepped in, I was greeted with a warm and inviting atmosphere. The staff was incredibly friendly and attentive, making sure that my dining experience was nothing short of perfect.'
    },
    {
      image: 'https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?size=626&ext=jpg&uid=R106669124&ga=GA1.1.1904170439.1707861205&semt=ais',
      name: 'Larry Benson',
      location: 'WA, USA',
      star: 4,
      testimonial: 'The restaurant is clean and well-maintained, with a modern aesthetic. Prices are reasonable for the quality of food and service. Overall, Eat With Oyin is a must-visit for anyone looking for a delightful dining experience.'
    },
  ]

  return (
    <div>
      <Hero
        title="Authentic Flavours. Unforgettable Moments"
        subtitle="Enjoy Rich Jollof Rice, Fried Rice, Succulent Chicken & Beef, Sweet Plantain and More, Made Just for you!"
        image={Rice}
      />
      <Whychooseus reasons={reasons} />
      <About
        image={OyinPlace}
        heading="About Us"
        about="We specialize in delicious meals prepared fresh and served with care, offering a wide variety of dishes created to satisfy different tastes and preferences. Whether you are craving a familiar local favorite or looking to try something exciting and different, we have something for everyone. Our staff is committed to providing excellent service while ensuring that every meal leaves you satisfied and coming back for more. At EATWITHOYIN, we are more than just a place to grab a meal; we are a destination for quality and memorable food experiences. Come taste the difference today!"
      />
      {/* We specialize in delicious meals prepared fresh and served with care, offering a wide variety of dishes created to satisfy different tastes and preferences. Whether you are craving a familiar local favorite or looking to try something exciting and different, we have something for everyone. Our team is dedicated to providing excellent service while ensuring that every meal leaves you satisfied and coming back for more. At our brand, we are more than just a place to grab a meal; we are a destination for quality, flavor, and memorable food experiences. Come taste the difference and discover your new favorite meal with us today! */}
      <Testimonial reviews={reviews} />
    </div>
  )
}

export default Home
