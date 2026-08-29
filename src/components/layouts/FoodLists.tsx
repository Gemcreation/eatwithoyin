import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import { addItem } from '../../features/checkList'

interface FoodListsProps {
    items: {
        image: string;
        name: string;
        price: string;
        des: string;
        qty: number;
    }[][];
}

const FoodLists: React.FC<FoodListsProps> = ({ items }) => {
    const dispatch = useDispatch()
    const [quantities, setQuantities] = useState<number[]>(Array(items.reduce((acc, cur) => acc + cur.length, 0)).fill(1))
    const [activeSlide, setActiveSlide] = useState(0)

    const listTabs = [
        'Menu',
        'Extras',
        'Drinks',
        'Snacks',
    ]

    const handelQuantityChange = (i: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Number(event.target.value.replace(/\D/g, ''))

        const validatedQuantity = Math.max(newQuantity, 0)

        setQuantities((prevQuantities) => [
            ...prevQuantities.slice(0, i),
            validatedQuantity,
            ...prevQuantities.slice(i+1),
        ])
    }

    const handleAddToCart = (index: number, i: number) => {
        if (quantities[i] === 0) {
            console.log(`button ${index} clicked but 0 quantity is not allowed`)
            return
        }
        const itemToAdd = items[index][i]

        dispatch(addItem({ ...itemToAdd, qty: quantities[i] }))

        console.log(addItem({ ...itemToAdd, qty: quantities[i] }))
    }

    const slideStyle = {
        transform: `translateX(-${(activeSlide * 100) / 1}%)`,
    }

    return (
        <section className='my-10 overflow-hidden h-fit'>
            <div className={`grid  grid-cols-4 gap-[12px]`}>
                {listTabs.map((tab, index) => (
                    <h3
                        key={index}
                        className={`text-lg font-bold cursor-pointer ${activeSlide === index ?     'text-primaryColor' : 'text-gray-500'}`}
                        onClick={() => setActiveSlide(index)}
                    >{tab}</h3>
                ))}
            </div>
            <div className='flex flex-row justify-start transition-transform duration-500 ease-in-out w-full' style={slideStyle}>
                {items.map((item, index) => (
                    <div key={index}
                        className={`min-w-[100%] flex-shrink-0 flex-grow-0 basis-[100%] flex flex-row  md:flex-nowrap lg:gap-[20px] mt-10 ${activeSlide === index ? 'active' : ''}`}
                    >
                        <div className='flex flex-col lg:grid gap-[30px] lg:grid-cols-5 lg:px-3 w-full h-fit'>
                            {item.map((each, i) => (
                                <div key={i} className='flex lg:flex-col lg:items-start gap-[20px] w-full lg:w-[200px] h-[100px] lg:h-auto'>
                                    <div className='w-[140px] lg:w-full h-[100px] lg:h-[150px]'>
                                        <img src={each.image} alt={`${each.name} image`} className='w-full h-full rounded-md  object-cover lg:object-fill' />
                                    </div>
                                    <div className='w-full'>
                                        <h3 className='text-[14px] lg:text-[16px] font-bold lg:mb-2'>{each.name}</h3>
                                        <p className='text-[10px] lg:text-[12px] text-slate-400 leading-[20px] lg:h-[50px] lg:mb-2'>{each.des}</p>
                                        <div className='flex justify-between mb-3'>
                                            <input name='qty' type='text' pattern='[1-9][0-9]*' value={quantities[i]} onChange={(event) => handelQuantityChange(i, event)} className='w-[50px] h-[30px] border outline-none rounded-md text-[12px] px-2 hidden lg:block' />
                                            <h3 className='text-[12px] lg:text-lg text-primaryColor font-bold'>₦{each.price}</h3>
                                        </div>
                                        <div className='flex gap-4'>
                                            <div className='flex items-center gap-[10px]'>
                                                <input name='qty' type='text' pattern='[1-9][0-9]*' value={quantities[i]} onChange={(event) => handelQuantityChange( i, event)} className='w-[50px] h-[30px] border outline-none rounded-md text-[12px] px-2 lg:hidden' />
                                                <button className='bg-primaryColor w-[70px] lg:hidden h-[30px] rounded-md text-sm text-mainColor' onClick={() => handleAddToCart(index, i)}>Add</button>
                                            </div>
                                        </div>
                                        <button className='bg-primaryColor hidden lg:block w-full h-[30px] rounded-md text-sm text-mainColor' onClick={() => handleAddToCart(index, i)}>Add</button>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                ))}
            </div>
      </section>
  )
}

export default FoodLists