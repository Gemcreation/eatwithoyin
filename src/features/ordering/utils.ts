import type { CartItem, CustomerOrder } from './types'

export const DELIVERY_FEE = 1200

export const calculateSubtotal = (items: Pick<CartItem, 'price' | 'quantity'>[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const createNextOrderId = (orders: Pick<CustomerOrder, 'id'>[]) => {
  const existingIds = new Set(orders.map((order) => order.id))
  const highestSequence = orders.reduce((highest, order) => {
    const match = /^EW-(\d+)$/.exec(order.id)
    const sequence = match ? Number(match[1]) : Number.NaN
    return Number.isSafeInteger(sequence) ? Math.max(highest, sequence) : highest
  }, 1023)

  const createRandomSequence = () => {
    try {
      if (typeof globalThis.crypto?.randomUUID === 'function') {
        return BigInt(`0x${globalThis.crypto.randomUUID().replaceAll('-', '').slice(0, 16)}`)
          .toString()
          .padStart(20, '0')
      }
      if (typeof globalThis.crypto?.getRandomValues === 'function') {
        const hex = [...globalThis.crypto.getRandomValues(new Uint32Array(2))]
          .map((value) => value.toString(16).padStart(8, '0'))
          .join('')
        return BigInt(`0x${hex}`).toString().padStart(20, '0')
      }
    } catch (error) {
      console.warn('[EatWithOyin] Browser crypto failed while generating an order ID; using the random fallback.', error)
    }

    return Math.floor(Math.random() * 1_000_000_000_000_000).toString().padStart(15, '0')
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `EW-${createRandomSequence()}`
    if (!existingIds.has(candidate)) return candidate
  }

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