import React, { useEffect, useState } from 'react'
import FoodLists from '../layouts/FoodLists'
// import CheckLists from '../layouts/CheckLists'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { items } from '../../api'

interface OrderProps {
    checkListFunction: () => void
}

const Order: React.FC<OrderProps> = ({ checkListFunction }) => {
    const checkListItems = useSelector((state: RootState) => state.checkList.listOfItems)
    // const [checkListSwitch, setCheckListSwitch] = useState(false)
    const [numbersOfItem, setNumberOfItems] = useState(0)

    useEffect(() => {
        const getNumbersOfItems = checkListItems.length

        setNumberOfItems(getNumbersOfItems)
    }, [checkListItems])

    return (
        <main className='max-w-[85%] mx-auto relative'>
            <header className=' flex flex-col lg:flex-row justify-between'>
                <div className='mt-10'>
                    <h1 className='text-2xl lg:text-4xl text-secondaryColor font-bold'>Order Your Cravings Now!</h1>
                    <p className='text-[14px] my-3'>Satisfy your cravings, place an order, and enjoy a delicious meal swiftly!</p>
                </div>

                <div className='lg:mt-10 sticky top-[10%]'>
                    <button onClick={checkListFunction} className='bg-amber-500 w-auto h-[40px] rounded-md text-mainColor px-2 text-[14px]'>Checklists ({numbersOfItem})</button>
                </div>
            </header>

            <section>
                <>
                    <FoodLists items={items} />
                </>
            </section>
        </main>
  )
}

export default Order