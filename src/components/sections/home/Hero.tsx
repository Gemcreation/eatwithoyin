import React from 'react'
import Coke from '../../../assets/images/coke.png'
import Juice from '../../../assets/images/juice.png'
import { animateCTABtns, animateFirstDrink, animateFoodImg, animateHeroHeadLine, animateHeroParagraph, animateSecondDrink } from '../../../../gsap'
import { useGSAP } from '@gsap/react'
import { useNavigate } from 'react-router-dom'


interface HeroProps {
    title: string
    subtitle: string
    image: string
    // absoluteImage: {src: string, top:string, left:string,  x:string, y: string}[] 
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, image }) => {
  const navigate = useNavigate()
    
  useGSAP(() => {
    animateHeroHeadLine('.hero-header', 0, 100, 1)
    animateHeroParagraph('.hero-paragraph', 0, 100, 1, 0.5)
    animateCTABtns('.hero-cta-btns', 0, 100, 1, 0.7)
    animateFoodImg('.rice-img', 0, 100, 1, 1)
    animateFirstDrink('.drink1', 0, 50, 1, 1)
    animateSecondDrink('.drink2', 0, -50, 1, 1.3)
  })
  
  return (
        <section className='relative mt-8 min-h-[660px] overflow-hidden lg:mt-0 lg:h-[90vh] lg:min-h-0'>
          <div className='max-w-[85%] min-h-[620px] mx-auto flex flex-col lg:h-[80vh] lg:min-h-0 lg:flex-row gap-[20px] justify-between items-center'>
              <div className='lg:w-[450px]'>
                  <h1 className='hero-header text-2xl lg:text-4xl text-primaryColor text-center lg:text-left font-bold leading-[50px]'>{title}</h1>
                  <p className='hero-paragraph mt-6 text-center lg:text-left text-[14px]'>{subtitle}</p>

                  <div className='hero-cta-btns mt-6 flex flex-row gap-[30px]'>
                    <button className='bg-primaryColor text-mainColor w-[150px] h-[40px] rounded-md' onClick={() => navigate('/menu')}>Order Food</button>
                    {/* <button className='border border-primaryColor text-primaryColor w-[150px] h-[40px] rounded-md'>Download App</button> */}
                  </div>
              </div>
            <div className='lg:w-[500px] relative '>
              <div className='w-[250px] h-[250px] lg:w-[400px] lg:h-[300px]'>
                    <img src={image} alt="image" className='rice-img w-full h-full object-contain' />
              </div>
                    <img src={Coke} alt="image" className='drink1 absolute top-[-8%] left-0 translate-x-0 lg:top-[50%] lg:left-[-10%] lg:translate-x-[-10%] w-[100px] h-[250px]' />
                    <img src={Juice} alt="image" className='drink2 absolute top-[-5%] left-[65%] -translate-x-full lg:top-[-10%] lg:left-[90%] lg:-translate-x-full w-[100px] h-[200px]' />
            </div>
          </div>
    </section>
  )
}

export default Hero
