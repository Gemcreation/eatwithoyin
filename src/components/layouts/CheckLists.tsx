import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { getItems, removeItem, updateItemQuantity } from '../../features/checkList'
import { Cancel01Icon, Delete01Icon } from 'hugeicons-react'
// import gsap from 'gsap'
import Location from './Location'

interface CheckListProps {
    closeCheckList: () => void
    // checkListSwitch: boolean
}

const CheckLists: React.FC<CheckListProps> = ({ closeCheckList}) => {
    const dispatch = useDispatch()
    const checkListItems = useSelector((state: RootState) => state.checkList.listOfItems)
    // const checkWindow: number = innerWidth
    const [isEmpty, setIsEmpty] = useState(true)
    const [subTotal, setSubTotal] = useState(0)
    const [delivery] = useState(0)
    const [popLocationInput, setPopUpLocationInput] = useState(false)

    useEffect(() => {
        setIsEmpty(checkListItems.length === 0)
    }, [checkListItems])

    useEffect(() => {
        dispatch(getItems())
    }, [dispatch])

    useEffect(() => {
        const total = checkListItems.reduce((accumulator, item) => accumulator + (item.price * item.qty), 0)

        setSubTotal(total)

        // if (total !== 0) {
            // const calculateDelivery = Math.round(((total / 10) + 100) * 2)
            
            // setDelivery(calculateDelivery)
            
        // }


    })

    const handelQuantityChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Number(event.target.value.replace(/\D/g, ''))

        const validatedQuantity = Math.max(newQuantity, 0)

        dispatch(updateItemQuantity({ name: checkListItems[index].name, quantity: validatedQuantity }))
    }

    const elementRef = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //     if (checkListSwitch && elementRef.current) {
    //         const tl = gsap.timeline()

    //         tl.fromTo(elementRef.current, {
    //             x: 100,
    //         }, {
    //             duration: 2,
    //             x: checkWindow > 760 ? 1 : -160,
    //             ease: 'power2.out',
    //             delay: 0
    //         })
    //     }
    // }, [checkListSwitch])

    const handleDeleteItem = (index: number) => {
        dispatch(removeItem({ name: checkListItems[index].name }))
    }

    return (
        <React.Fragment>
            <main ref={elementRef} className={`w-full lg:w-[450px] shadow-md rounded-md`}>
                    <Cancel01Icon size={20} className='absolute left-[92%] translate-x-[-92%] top-3' onClick={closeCheckList} />
                    <div className='max-w-[90%] mx-auto py-3'>
                        <header className=''>
                            <h1 className='text-xl font-medium'>Checklists</h1>
                            <p className='text-[12px] italic'>Preview Your Order</p>
                        </header>

                        <section className='checkList'>
                            {isEmpty
                                ? (
                                    <h1 className='text-xl text-center'>Your selection is empty!</h1>
                                )
                                : (
                                    <div className='flex flex-col gap-[12px] mt-6'>
                                        {checkListItems.map((item, index) => (
                                            <div key={index} className='relative flex items-center justify-between'>
                                                
                                                <div className='flex items-center gap-[10px] w-[210px]'>
                                                    <div className='w-[50px] h-[50px]'>
                                                        <img src={item.image} alt='' className='w-full h-full object-cover' />
                                                    </div>

                                                    <div>
                                                        <h1 className='text-[12px] lg:text-[14px] font-medium'>{item.name}</h1>
                                                        <p className='text-[10px] lg:text-[12px] text-[#969494dd]'>Price: ₦{ item.price}</p>
                                                    </div>
                                                </div>
                                                <div className='w-[50px]'>
                                                    <input name='qty' pattern='[1-9][0-9]*' type="text" value={item.qty} onChange={(event) => handelQuantityChange(index, event)} className='outline-none border w-[35px] lg:w-[50px] h-[30px] text-center text-[12px] rounded' />
                                                </div>
                                                <div className='flex items-center gap-[12px]'>
                                                    <h1 className='text-[14px] text-primaryColor text-start font-bold lg:w-[50px]'>₦{Math.round(item.price * item.qty)}</h1>
                                                    <Delete01Icon size={16} className='text-primaryColor cursor-pointer' onClick={() => handleDeleteItem(index)} />
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                )
                        }
                        </section>
                        <div className='mt-3'>
                            <h1 className='text-lg lg:text-xl'>Order summary</h1>
                            <hr className='mb-2'/>

                            <div className='flex flex-col gap-[12px]'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-[14px] font-bold'>Sub Total</h3>
                                    <h3 className='text-[14px] font-bold'>₦{ subTotal}</h3>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-[14px] font-bold'>Delivery Fee</h3>
                                    <h3 className='text-[14px] font-bold'>{delivery === 0 ? (<em className='text-[12px] text-altColor cursor-pointer' onClick={() => setPopUpLocationInput(true)}>Enumerate</em>) : '' }</h3>
                                </div>
                                <hr className='mb-2' />
                                <div className='flex items-center justify-between mb-3'>
                                    <h2 className='text-xl font-bold text-primaryColor'>Total</h2>
                                    <h2 className='text-xl font-bold text-primaryColor'>₦{Math.round(subTotal + delivery)}</h2>
                                </div>
                            </div>

                            <button className='w-full h-[35px] bg-primaryColor rounded text-mainColor text-[14px]'>Ready to Order?</button>
                        </div>
                    </div>
            </main>
            {popLocationInput && (
                <Location />
            )}
        </React.Fragment>
  )
}

export default CheckLists
