export type FoodCategory = 'Rice' | 'Chicken' | 'Local Dishes' | 'Drinks' | 'Snacks'

export interface Food {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: FoodCategory
  available: boolean
}

export interface CartItem {
  foodId: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface Customer {
  fullName: string
  phone: string
}

export interface DeliveryAddress {
  address: string
  landmark: string
  city: string
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'

export type PaymentMethod = 'Cash on delivery'

export interface CustomerOrder {
  id: string
  customer: Customer
  deliveryAddress: DeliveryAddress
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
}