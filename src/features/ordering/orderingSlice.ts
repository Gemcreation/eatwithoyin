import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { defaultFoods, defaultKitchenSettings } from './data'
import type { CartItem, CustomerOrder, Food, KitchenSettings, OrderStatus, Rider } from './types'

export const ORDER_STORAGE_KEY = 'ew-customer-orders'
export const DELETED_DEMO_ORDER_STORAGE_KEY = 'ew-deleted-demo-orders'

const readStoredArray = <T,>(key: string): T[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value as T[] : []
  } catch {
    return []
  }
}

const orderStatuses = new Set<OrderStatus>([
  'ORDER_PLACED',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'RIDER_ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isText = (value: unknown): value is string => typeof value === 'string'
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isRider = (value: unknown): value is Rider =>
  isRecord(value) &&
  isText(value.id) &&
  isText(value.name) &&
  isText(value.phone) &&
  isText(value.vehicleType) &&
  isText(value.vehicleRegistration)

export const isCustomerOrder = (value: unknown): value is CustomerOrder => {
  if (!isRecord(value) || !isRecord(value.customer) || !isRecord(value.deliveryAddress)) return false
  if (!Array.isArray(value.items) || value.items.length === 0) return false
  if (!isText(value.id) || !value.id.trim() || !isText(value.createdAt) || !Number.isFinite(Date.parse(value.createdAt))) return false
  if (value.updatedAt !== undefined && (!isText(value.updatedAt) || !Number.isFinite(Date.parse(value.updatedAt)))) return false
  if (!isText(value.customer.fullName) || !isText(value.customer.phone)) return false
  if (!isText(value.deliveryAddress.address) || !isText(value.deliveryAddress.landmark) || !isText(value.deliveryAddress.city)) return false
  if (!value.items.every((item) =>
    isRecord(item) &&
    isText(item.foodId) &&
    isText(item.name) &&
    isText(item.image) &&
    isFiniteNumber(item.price) &&
    item.price >= 0 &&
    isFiniteNumber(item.quantity) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )) return false
  if (!isFiniteNumber(value.subtotal) || value.subtotal < 0 ||
      !isFiniteNumber(value.deliveryFee) || value.deliveryFee < 0 ||
      !isFiniteNumber(value.total) || value.total < 0) return false
  if (value.paymentMethod !== 'Cash on delivery' || !isText(value.status) || !orderStatuses.has(value.status as OrderStatus)) return false
  if (value.rider !== undefined && !isRider(value.rider)) return false
  if (value.isDemo !== undefined && typeof value.isDemo !== 'boolean') return false

  const status = value.status as OrderStatus
  if (['RIDER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status) && !value.rider) return false
  return true
}

const statusProgress: Record<OrderStatus, number> = {
  ORDER_PLACED: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY_FOR_PICKUP: 3,
  RIDER_ASSIGNED: 4,
  PICKED_UP: 5,
  OUT_FOR_DELIVERY: 6,
  DELIVERED: 7,
  CANCELLED: 1,
}

const allowedOrderTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  ORDER_PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING'],
  PREPARING: ['READY_FOR_PICKUP'],
  READY_FOR_PICKUP: ['RIDER_ASSIGNED'],
  RIDER_ASSIGNED: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export const canTransitionOrderStatus = (current: OrderStatus, next: OrderStatus) =>
  allowedOrderTransitions[current].includes(next)

const orderTimestamp = (order: CustomerOrder) =>
  Date.parse(order.updatedAt ?? order.createdAt) || 0

const preferOrder = (existing: CustomerOrder, incoming: CustomerOrder) => {
  const existingProgress = statusProgress[existing.status]
  const incomingProgress = statusProgress[incoming.status]
  if (incomingProgress !== existingProgress) return incomingProgress > existingProgress ? incoming : existing
  const existingTimestamp = orderTimestamp(existing)
  const incomingTimestamp = orderTimestamp(incoming)
  if (incomingTimestamp !== existingTimestamp) return incomingTimestamp > existingTimestamp ? incoming : existing
  return JSON.stringify(incoming).localeCompare(JSON.stringify(existing)) > 0 ? incoming : existing
}

const mergeOrders = (current: CustomerOrder[], incoming: CustomerOrder[]) => {
  const byId = new Map(current.map((order) => [order.id, order]))
  incoming.forEach((order) => {
    const existing = byId.get(order.id)
    byId.set(order.id, existing ? preferOrder(existing, order) : order)
  })
  return [...byId.values()]
}

export const parseStoredOrders = (raw: string | null): CustomerOrder[] => {
  if (!raw) return []
  try {
    const stored: unknown = JSON.parse(raw)
    if (!Array.isArray(stored)) {
      console.warn(`[EatWithOyin] Ignoring invalid order storage in "${ORDER_STORAGE_KEY}": expected an array.`)
      return []
    }
    const validOrders = stored.filter(isCustomerOrder)
    if (validOrders.length !== stored.length) {
      console.warn(`[EatWithOyin] Ignored ${stored.length - validOrders.length} invalid order record(s) in "${ORDER_STORAGE_KEY}".`)
    }
    return mergeOrders([], validOrders)
  } catch (error) {
    console.error(`[EatWithOyin] Could not parse orders from "${ORDER_STORAGE_KEY}".`, error)
    return []
  }
}

export const parseDeletedDemoOrderIds = (raw: string | null): string[] => {
  if (!raw) return []
  try {
    const stored: unknown = JSON.parse(raw)
    if (!Array.isArray(stored)) return []
    return [...new Set(stored.filter((id): id is string => isText(id) && id.length > 0))]
  } catch (error) {
    console.error(`[EatWithOyin] Could not parse deleted demo order IDs from "${DELETED_DEMO_ORDER_STORAGE_KEY}".`, error)
    return []
  }
}

const readStoredOrders = () => {
  try {
    return parseStoredOrders(localStorage.getItem(ORDER_STORAGE_KEY))
  } catch (error) {
    console.error(`[EatWithOyin] Could not read orders from "${ORDER_STORAGE_KEY}".`, error)
    return []
  }
}

const readDeletedDemoOrderIds = () => {
  try {
    return parseDeletedDemoOrderIds(localStorage.getItem(DELETED_DEMO_ORDER_STORAGE_KEY))
  } catch (error) {
    console.error(`[EatWithOyin] Could not read "${DELETED_DEMO_ORDER_STORAGE_KEY}".`, error)
    return []
  }
}

interface OrderingState {
  cart: CartItem[]
  orders: CustomerOrder[]
  deletedDemoOrderIds: string[]
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
const deletedDemoOrderIds = readDeletedDemoOrderIds()

const initialState: OrderingState = {
  cart: readStoredArray<CartItem>('ew-customer-cart'),
  orders: readStoredOrders().filter((order) => !order.isDemo || !deletedDemoOrderIds.includes(order.id)),
  deletedDemoOrderIds,
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
      if (!isCustomerOrder(action.payload) || state.orders.some((order) => order.id === action.payload.id)) return
      state.orders.unshift(action.payload)
    },
    saveDemoOrder: (state, action: PayloadAction<CustomerOrder>) => {
      const existingDemoOrder = state.orders.some((order) => order.isDemo)
      if (action.payload.isDemo && !existingDemoOrder &&
          isCustomerOrder(action.payload) &&
          !state.deletedDemoOrderIds.includes(action.payload.id) &&
          !state.orders.some((order) => order.id === action.payload.id)) {
        state.orders.unshift(action.payload)
      }
    },
    resetDemoOrders: (state) => {
      state.deletedDemoOrderIds = [...new Set([
        ...state.deletedDemoOrderIds,
        ...state.orders.filter((order) => order.isDemo).map((order) => order.id),
      ])]
      state.orders = state.orders.filter((order) => !order.isDemo)
    },
    synchronizeOrders: (state, action: PayloadAction<{ orders: CustomerOrder[]; removedDemoOrderIds: string[] }>) => {
      const deletedDemoOrderIds = new Set([
        ...state.deletedDemoOrderIds,
        ...action.payload.removedDemoOrderIds,
      ])
      state.deletedDemoOrderIds = [...deletedDemoOrderIds]
      const retainedOrders = state.orders.filter((order) => !(order.isDemo && deletedDemoOrderIds.has(order.id)))
      state.orders = mergeOrders(
        retainedOrders,
        action.payload.orders.filter((order) => isCustomerOrder(order) && (!order.isDemo || !deletedDemoOrderIds.has(order.id))),
      )
    },
    removeUnpersistedOrder: (state, action: PayloadAction<{ orderId: string; createdAt: string }>) => {
      state.orders = state.orders.filter((order) =>
        order.id !== action.payload.orderId || order.createdAt !== action.payload.createdAt
      )
    },
    setOrderStatus: {
      reducer: (state, action: PayloadAction<{ orderId: string; status: OrderStatus; updatedAt: string }>) => {
        const order = state.orders.find((item) => item.id === action.payload.orderId)
        const nextStatus = action.payload.status
        if (!order || !canTransitionOrderStatus(order.status, nextStatus)) return
        if (['RIDER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(nextStatus) && !order.rider) return
        order.status = nextStatus
        order.updatedAt = action.payload.updatedAt
      },
      prepare: (payload: { orderId: string; status: OrderStatus }) => ({
        payload: { ...payload, updatedAt: new Date().toISOString() },
      }),
    },
    assignRiderToOrder: {
      reducer: (state, action: PayloadAction<{ orderId: string; rider: Rider; updatedAt: string }>) => {
        const order = state.orders.find((item) => item.id === action.payload.orderId)
        if (!order ||
            !allowedOrderTransitions[order.status].includes('RIDER_ASSIGNED') ||
            !isRider(action.payload.rider)) return
        order.rider = action.payload.rider
        order.status = 'RIDER_ASSIGNED'
        order.updatedAt = action.payload.updatedAt
      },
      prepare: (payload: { orderId: string; rider: Rider }) => ({
        payload: { ...payload, updatedAt: new Date().toISOString() },
      }),
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
  synchronizeOrders,
  removeUnpersistedOrder,
  setOrderStatus,
  assignRiderToOrder,
  setRiderOnline,
  addFood,
  updateFood,
  toggleFoodAvailability,
  updateKitchenSettings,
} = orderingSlice.actions
export default orderingSlice.reducer