import { createSlice } from "@reduxjs/toolkit";

interface CheckListSliceState {
    listOfItems: {
        name: string,
        image: string,
        price: number,
        qty: number
    }[]
}

const initialState: CheckListSliceState = {
    listOfItems: []
}

const checkListSlice = createSlice({
    name: 'checkList',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.listOfItems.unshift(action.payload)
            localStorage.setItem('items', JSON.stringify(state.listOfItems))
        },
        getItems: (state) => {
            const itemsFromStorage = localStorage.getItem('items')

            if (itemsFromStorage) {
                state.listOfItems = JSON.parse(itemsFromStorage)
            }
        },
        updateItemQuantity: (state, action) => {
            const itemIndex = state.listOfItems.findIndex((item) => item.name === action.payload.name)

            if (itemIndex !== -1) {
                state.listOfItems[itemIndex].qty = action.payload.quantity
                localStorage.setItem('items', JSON.stringify(state.listOfItems))
            }
        },
        removeItem: (state, action) => {
            const newListOfItems =  state.listOfItems.filter((item) => item.name !== action.payload.name)
            
            state.listOfItems = newListOfItems

            localStorage.setItem('items', JSON.stringify(state.listOfItems))
        }
        
    }
})

export const { addItem, getItems, updateItemQuantity, removeItem } = checkListSlice.actions

export default checkListSlice.reducer