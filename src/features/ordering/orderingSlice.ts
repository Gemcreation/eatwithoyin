import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, CustomerOrder } from './types'

const readStoredArray = <T,>(key: string): T[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value as T[] : []
  } catch {
    return []
  }
}

interface OrderingState {
  cart: CartItem[]
  orders: CustomerOrder[]
}

const initialState: OrderingState = {
  cart: readStoredArray<CartItem>('ew-customer-cart'),
  orders: readStoredArray<CustomerOrder>('ew-customer-orders'),
}

const orderingSlice = createSlice({
  name: 'ordering',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.cart.find((item) => item.foodId === action.payload.foodId)
      if (existing) existing.quantity += action.payload.quantity
      else state.cart.push(action.payload)
    },
    setCartQuantity: (state, action: PayloadAction<{ foodId: string; quantity: number }>) => {
      const item = state.cart.find((entry) => entry.foodId === action.payload.foodId)
      if (item) item.quantity = Math.max(1, action.payload.quantity)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.foodId !== action.payload)
    },
    clearCart: (state) => {
      state.cart = []
    },
    saveOrder: (state, action: PayloadAction<CustomerOrder>) => {
      state.orders.unshift(action.payload)
    },
  },
})

export const { addToCart, setCartQuantity, removeFromCart, clearCart, saveOrder } = orderingSlice.actions
export default orderingSlice.reducer