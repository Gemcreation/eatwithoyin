import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { defaultFoods, defaultKitchenSettings } from './data'
import type { CartItem, CustomerOrder, Food, KitchenSettings, OrderStatus, Rider } from './types'

export const ORDER_STORAGE_KEY = 'ew-customer-orders'
export const DELETED_DEMO_ORDER_STORAGE_KEY = 'ew-deleted-demo-orders'

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
const isRequiredText = (value: unknown): value is string =>
  isText(value) && value.trim().length > 0
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isFoodCategory = (value: unknown): value is Food['category'] =>
  value === 'Rice' ||
  value === 'Chicken' ||
  value === 'Local Dishes' ||
  value === 'Extras' ||
  value === 'Drinks' ||
  value === 'Snacks'

const isCartItem = (value: unknown): value is CartItem =>
  isRecord(value) &&
  isRequiredText(value.foodId) &&
  isRequiredText(value.name) &&
  isRequiredText(value.image) &&
  isFiniteNumber(value.price) &&
  value.price >= 0 &&
  isFiniteNumber(value.quantity) &&
  Number.isInteger(value.quantity) &&
  value.quantity > 0

const isFood = (value: unknown): value is Food =>
  isRecord(value) &&
  isRequiredText(value.id) &&
  isRequiredText(value.name) &&
  isText(value.description) &&
  isFiniteNumber(value.price) &&
  value.price >= 0 &&
  isRequiredText(value.image) &&
  isFoodCategory(value.category) &&
  typeof value.available === 'boolean'

const parseStoredArray = <T,>(
  raw: string | null,
  key: string,
  isValid: (value: unknown) => value is T,
): T[] => {
  if (raw === null) return []

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch (error) {
    console.error(`[EatWithOyin] Could not parse "${key}" from localStorage.`, error)
    return []
  }

  if (!Array.isArray(value)) {
    console.warn(`[EatWithOyin] Ignoring invalid data in "${key}": expected an array.`)
    return []
  }

  const validRecords = value.filter(isValid)
  if (validRecords.length !== value.length) {
    console.warn(`[EatWithOyin] Ignored ${value.length - validRecords.length} invalid record(s) in "${key}".`)
  }
  return validRecords
}

const readStoredArray = <T,>(
  key: string,
  isValid: (value: unknown) => value is T,
): T[] => {
  try {
    return parseStoredArray(localStorage.getItem(key), key, isValid)
  } catch (error) {
    console.error(`[EatWithOyin] Could not read "${key}" from localStorage.`, error)
    return []
  }
}

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

const isKitchenTime = (value: unknown): value is string =>
  isText(value) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)

const readKitchenSettings = (): KitchenSettings => {
  let raw: string | null
  try {
    raw = localStorage.getItem('ew-kitchen-settings')
  } catch (error) {
    console.error('[EatWithOyin] Could not read "ew-kitchen-settings" from localStorage.', error)
    return { ...defaultKitchenSettings }
  }

  if (raw === null) return { ...defaultKitchenSettings }

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch (error) {
    console.error('[EatWithOyin] Could not parse "ew-kitchen-settings" from localStorage.', error)
    return { ...defaultKitchenSettings }
  }

  if (!isRecord(value)) {
    console.warn('[EatWithOyin] Ignoring invalid data in "ew-kitchen-settings": expected an object.')
    return { ...defaultKitchenSettings }
  }

  const settings = { ...defaultKitchenSettings }
  const invalidFields: string[] = []
  if (isRequiredText(value.name)) settings.name = value.name
  else invalidFields.push('name')
  if (isRequiredText(value.phone)) settings.phone = value.phone
  else invalidFields.push('phone')
  if (isRequiredText(value.address)) settings.address = value.address
  else invalidFields.push('address')
  if (isKitchenTime(value.openingTime)) settings.openingTime = value.openingTime
  else invalidFields.push('openingTime')
  if (isKitchenTime(value.closingTime)) settings.closingTime = value.closingTime
  else invalidFields.push('closingTime')
  if (typeof value.isOpen === 'boolean') settings.isOpen = value.isOpen
  else invalidFields.push('isOpen')
  if (typeof value.deliveryAvailable === 'boolean') {
    settings.deliveryAvailable = value.deliveryAvailable
  } else {
    invalidFields.push('deliveryAvailable')
  }
  if (isFiniteNumber(value.deliveryFee) && value.deliveryFee >= 0) settings.deliveryFee = value.deliveryFee
  else invalidFields.push('deliveryFee')

  if (invalidFields.length > 0) {
    console.warn(`[EatWithOyin] Restored defaults for invalid or missing kitchen setting(s): ${invalidFields.join(', ')}.`)
  }
  return settings
}

const readStoredBoolean = (key: string, fallback: boolean) => {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : value === 'true'
  } catch {
    return fallback
  }
}

const storedFoods = readStoredArray('ew-menu-foods', isFood)
const foodsById = new Map(defaultFoods.map((food) => [food.id, food]))
storedFoods.forEach((food) => foodsById.set(food.id, food))
const deletedDemoOrderIds = readDeletedDemoOrderIds()

const initialState: OrderingState = {
  cart: readStoredArray('ew-customer-cart', isCartItem),
  orders: readStoredOrders().filter((order) => !order.isDemo || !deletedDemoOrderIds.includes(order.id)),
  deletedDemoOrderIds,
  foods: [...foodsById.values()],
  kitchenSettings: readKitchenSettings(),
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