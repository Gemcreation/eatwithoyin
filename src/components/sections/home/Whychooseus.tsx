import React from 'react'

interface WhyChooseUsProps {
    reasons: {
        image: {src: string, alt: string}
        subtitle: string
        paragraph: string
    }[]
}

const Whychooseus: React.FC<WhyChooseUsProps> = ({ reasons }) => {
    
    return (
        <section className=''>
            <div className='max-w-[85%] mx-auto'>
                <h1 className='text-center text-2xl lg:text-4xl font-bold'>Why <span className='choose-us-text text-primaryColor'>Choose Us</span></h1>
                <p className='text-[12px] text-center mt-3'>This is What Makes Us Your Perfect Choice</p>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-[20px] mt-8'>
                    {reasons.map((reason, index) => (
                        <div key={index} className='custom-shadow why-choose-us flex flex-col lg:w-[350px] h-[330px] p-5 rounded-md'>
                            <div className={`wcu-${index} w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]`}>
                                <img src={reason.image.src} alt={reason.image.alt} className='rounded-xl w-full h-full' />
                            </div>
                            <div className='wcu-content flex flex-col justify-center'>
                                <h3 className='text-lg lg:text-xl font-bold h-[40px] mt-5'>{reason.subtitle}</h3>
                                <p className='mt-3 text-[13px]'>{reason.paragraph}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
      </section>
  )
}

export default Whychooseus