import type { CartItem, CustomerOrder } from './types'

export const DELIVERY_FEE = 1200

export const calculateSubtotal = (items: Pick<CartItem, 'price' | 'quantity'>[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const createNextOrderId = (orders: Pick<CustomerOrder, 'id'>[]) => {
  const existingIds = new Set(orders.map((order) => order.id))
  const highestSequence = orders.reduce((highest, order) => {
    const match = /^EW-(\d+)$/.exec(order.id)
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 1023)

  let sequence = highestSequence + 1
  while (existingIds.has(`EW-${sequence}`)) sequence += 1
  return `EW-${sequence}`
}

export const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)