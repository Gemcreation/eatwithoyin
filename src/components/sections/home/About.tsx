import React from 'react'
import { useNavigate } from 'react-router-dom'

interface AboutProps {
    image: string
    heading: string
    about: string
}

const About: React.FC<AboutProps> = ({ image, heading, about }) => {
    const navigate = useNavigate()
    return (
        <section className='bg-secondaryColor lg:h-[500px] my-10 py-10 lg:py-0'>
            <div className='flex flex-col lg:flex-row gap-[20px] items-center justify-between max-w-[85%] mx-auto'>
                <div className='text-mainColor lg:w-[500px]'>
                    <h1 className='text-2xl lg:text-4xl font-bold'>{heading.split(' ')[0]} <span className='text-primaryColor'>{heading.split(' ')[1] }</span></h1>
                    <p className='text-[12px] mt-5'>{about}</p>
                    <div className='mt-5'>
                        <button className='bg-primaryColor w-[150px] h-[40px] rounded-md' onClick={() => navigate('/place-order')}>Order food                            
                        </button>
                    </div>
                </div>
                <div className='lg:w-[500px] h-[500px] rounded-md lg:rounded-none'>
                    <img src={image} alt="" className='w-full h-full' />
                </div>
            </div>
        </section>
    )
}

export default About