import type { CustomerOrder, Rider } from '../ordering/types'

export const mockRider: Rider = {
  id: 'RIDER-001',
  name: 'Demo Rider',
  phone: '+234 800 555 0199',
  vehicleType: 'Motorcycle',
  vehicleRegistration: 'LAG-001EW',
}

const activeStatuses = new Set(['RIDER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'])

export const getAvailableDeliveries = (orders: CustomerOrder[], online: boolean) =>
  online ? orders.filter((order) => order.status === 'READY_FOR_PICKUP') : []

export const getActiveDeliveries = (orders: CustomerOrder[]) =>
  orders.filter((order) => order.rider?.id === mockRider.id && activeStatuses.has(order.status))

export const getCompletedDeliveries = (orders: CustomerOrder[]) =>
  orders.filter((order) => order.rider?.id === mockRider.id && order.status === 'DELIVERED')

export const getCompletedDeliveriesToday = (orders: CustomerOrder[]) => {
  const today = new Date().toDateString()
  return getCompletedDeliveries(orders).filter((order) => new Date(order.createdAt).toDateString() === today)
}