import type { CustomerOrder, Food, KitchenSettings } from '../ordering/types'
import { calculateSubtotal, createNextOrderId } from '../ordering/utils'

interface DemoOrderInput {
  orders: CustomerOrder[]
  foods: Food[]
  kitchenSettings: KitchenSettings
  createdAt?: Date
}

export const findDemoOrder = (orders: CustomerOrder[]) =>
  orders.find((order) => order.isDemo)

export const buildDemoOrder = ({ orders, foods, kitchenSettings, createdAt = new Date() }: DemoOrderInput): CustomerOrder => {
  const availableFoods = foods.filter((food) => food.available)
  if (availableFoods.length < 2) {
    throw new Error('At least two available menu items are needed to create a demo order.')
  }

  const selectedFoods = availableFoods.slice(0, 3)
  const items = selectedFoods.map((food, index) => ({
    foodId: food.id,
    name: food.name,
    image: food.image,
    price: food.price,
    quantity: index === 0 ? 2 : 1,
  }))
  const subtotal = calculateSubtotal(items)
  const deliveryFee = kitchenSettings.deliveryFee

  return {
    id: createNextOrderId(orders),
    customer: { fullName: 'Abdulmojeed Bello', phone: '0803 555 0142' },
    deliveryAddress: {
      address: '14 Adejare Estate',
      landmark: 'Near the community gate',
      city: 'Ogbomoso',
    },
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    paymentMethod: 'Cash on delivery',
    status: 'ORDER_PLACED',
    createdAt: createdAt.toISOString(),
    isDemo: true,
  }
}