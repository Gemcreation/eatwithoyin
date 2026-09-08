import React from 'react'
import { useNavigate } from 'react-router-dom'
import { items } from '../../api'

const Gallery: React.FC = () => {
  const navigate = useNavigate()
  const galleryItems = items.flat()

  return (
    <main className='max-w-[85%] mx-auto py-10'>
      <header>
        <h1 className='text-2xl lg:text-4xl text-secondaryColor font-bold'>Our Food Gallery</h1>
        <p className='text-[14px] my-3'>Explore our selection of freshly prepared meals, drinks, and treats.</p>
      </header>

      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] my-10'>
        {galleryItems.map((item, index) => (
          <article key={`${item.name}-${index}`} className='custom-shadow rounded-md overflow-hidden flex flex-col'>
            <div className='w-full h-[220px]'>
              <img src={item.image} alt={`${item.name} image`} className='w-full h-full object-cover' />
            </div>
            <div className='p-5 flex flex-col flex-1'>
              <h2 className='text-lg font-bold'>{item.name}</h2>
              <p className='text-[12px] text-slate-400 leading-[20px] mt-2 flex-1'>{item.des}</p>
              <div className='flex items-center justify-between gap-4 mt-5'>
                <h3 className='text-lg text-primaryColor font-bold'>₦{item.price}</h3>
                <button className='bg-primaryColor w-[100px] h-[35px] rounded-md text-mainColor text-[14px]' onClick={() => navigate('/place-order')}>Order</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Gallery
