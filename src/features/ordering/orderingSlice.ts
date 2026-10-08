import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { defaultFoods, defaultKitchenSettings } from './data'
import type { CartItem, CustomerOrder, Food, KitchenSettings, OrderStatus, Rider } from './types'

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
  foods: Food[]
  kitchenSettings: KitchenSettings
  riderOnline: boolean
}

const readStoredObject = <T,>(key: string, fallback: T): T => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')
    return value && typeof value === 'object' ? { ...fallback, ...value } : fallback
  } catch {
    return fallback
  }
}

const readStoredBoolean = (key: string, fallback: boolean) => {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : value === 'true'
  } catch {
    return fallback
  }
}

const storedFoods = readStoredArray<Food>('ew-menu-foods')
const foodsById = new Map(defaultFoods.map((food) => [food.id, food]))
storedFoods.forEach((food) => foodsById.set(food.id, food))

const initialState: OrderingState = {
  cart: readStoredArray<CartItem>('ew-customer-cart'),
  orders: readStoredArray<CustomerOrder>('ew-customer-orders'),
  foods: [...foodsById.values()],
  kitchenSettings: readStoredObject<KitchenSettings>('ew-kitchen-settings', defaultKitchenSettings),
  riderOnline: readStoredBoolean('ew-rider-online', true),
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
    saveDemoOrder: (state, action: PayloadAction<CustomerOrder>) => {
      const existingDemoOrder = state.orders.some((order) => order.isDemo)
      if (action.payload.isDemo && !existingDemoOrder) state.orders.unshift(action.payload)
    },
    resetDemoOrders: (state) => {
      state.orders = state.orders.filter((order) => !order.isDemo)
    },
    setOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const order = state.orders.find((item) => item.id === action.payload.orderId)
      if (order) order.status = action.payload.status
    },
    assignRiderToOrder: (state, action: PayloadAction<{ orderId: string; rider: Rider }>) => {
      const order = state.orders.find((item) => item.id === action.payload.orderId)
      if (order?.status === 'READY_FOR_PICKUP') {
        order.rider = action.payload.rider
        order.status = 'RIDER_ASSIGNED'
      }
    },
    setRiderOnline: (state, action: PayloadAction<boolean>) => {
      state.riderOnline = action.payload
    },
    addFood: (state, action: PayloadAction<Food>) => {
      state.foods.unshift(action.payload)
    },
    updateFood: (state, action: PayloadAction<Food>) => {
      const index = state.foods.findIndex((food) => food.id === action.payload.id)
      if (index !== -1) state.foods[index] = action.payload
    },
    toggleFoodAvailability: (state, action: PayloadAction<string>) => {
      const food = state.foods.find((item) => item.id === action.payload)
      if (food) food.available = !food.available
    },
    updateKitchenSettings: (state, action: PayloadAction<KitchenSettings>) => {
      state.kitchenSettings = action.payload
    },
  },
})

export const {
  addToCart,
  setCartQuantity,
  removeFromCart,
  clearCart,
  saveOrder,
  saveDemoOrder,
  resetDemoOrders,
  setOrderStatus,
  assignRiderToOrder,
  setRiderOnline,
  addFood,
  updateFood,
  toggleFoodAvailability,
  updateKitchenSettings,
} = orderingSlice.actions
export default orderingSlice.reducer