import React from 'react'
// assets-images
import Logo from '../../assets/images/OyinLogo.png'
import {CallIcon, CopyrightIcon, Facebook01Icon, InstagramIcon, Mail01Icon, TwitterSquareIcon } from 'hugeicons-react'

type SocialMedia = {
    icon: React.ComponentType<{size: number}>,
    to: string,
}

type FeedbackHandles = {
    email: string,
    phoneNumber: string
    icon: React.ComponentType<{ size: number }>[]
}

const Footer: React.FC = () => {

    const socialLinks: SocialMedia[] = [
        {
            icon: TwitterSquareIcon,
            to: ''
        },
        {
            icon: Facebook01Icon,
            to: ''
        },
        {
            icon: InstagramIcon,
            to: ''
        },
    ]

    const feedback: FeedbackHandles = {
        email: 'support@eatwithoyin.com',
        phoneNumber: '+2349037721921',
        icon: [Mail01Icon, CallIcon]
    }

    return (
        <section className='bg-secondaryColor text-mainColor'>
            <div className='max-w-[85%] mx-auto'>
                <div className='flex justify-between items-center'>
                    <div className='w-[75px] h-[70px] shrink-0 flex items-center justify-center overflow-hidden'>
                        <img src={Logo} alt="logo" className='max-w-full max-h-full object-contain object-center' />
                    </div>

                    <div className='hidden lg:flex flex-col'>
                        <p className='text-[12px] text-center mb-2'>Got a question or feedback? We'd love to hear from you!</p>
                        <div className='text-[12px] flex flex-row gap-[30px]'>
                            <div className='flex gap-3'>
                                {React.createElement(feedback.icon[0], {size: 20})}
                                <a href={`mailto:${feedback.email}`}>{ feedback.email}</a>
                            </div>
                            <div className='flex gap-3'>   
                                {React.createElement(feedback.icon[1], {size: 20})}
                                <a href={`tel:${feedback.phoneNumber}`}>{feedback.phoneNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, "$1 - $2 - $3 - $4")}</a>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-[12px]'>
                        {socialLinks.map((link, index) => (
                            <a key={index} href={link.to}>
                                <link.icon size={24} />
                            </a>
                        ))}
                    </div>
                </div>
                <hr className='border border-altColor border-opacity-55 w-full h-[1px] my-2' />

                <div className='flex flex-col justify-center items-center lg:hidden my-5'>
                        <p className='text-[12px] text-center mb-2'>Got a question or feedback? We'd love to hear from you!</p>
                        <div className='text-[12px] flex flex-col gap-[30px]'>
                            <div className='flex gap-3'>
                                {React.createElement(feedback.icon[0], {size: 20})}
                                <a href={`mailto:${feedback.email}`}>{ feedback.email}</a>
                            </div>
                            <div className='flex gap-3'>   
                                {React.createElement(feedback.icon[1], {size: 20})}
                                <a href={`tel:${feedback.phoneNumber}`}>{feedback.phoneNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, "$1 - $2 - $3 - $4")}</a>
                            </div>
                        </div>
                    </div>

                <p className='text-[12px] text-center'>We understand the importance of convenience and quality when it comes to mealtime.</p>

                <div className='flex items-center justify-center gap-[12px] py-5'>
                    <CopyrightIcon size={24} /> <span>2026</span>
                    <h5>
                        <span className='text-primaryColor'>EAT</span>
                        <span className='text-altColor'>WITH</span>
                        <span className='text-primaryColor'>(</span>
                        <span className='text-mainColor'>OYIN</span>
                        <span className='text-primaryColor'>)</span>
                    </h5>
                </div>
            </div>
      </section>
  )
}

export default Footer
