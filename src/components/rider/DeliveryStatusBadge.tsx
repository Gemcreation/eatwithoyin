import type { OrderStatus } from '../../features/ordering/types'

const labels: Partial<Record<OrderStatus, string>> = {
  READY_FOR_PICKUP: 'Ready for pickup',
  RIDER_ASSIGNED: 'Rider assigned',
  PICKED_UP: 'Picked up',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
}

interface DeliveryStatusBadgeProps {
  status: OrderStatus
}

const DeliveryStatusBadge = ({ status }: DeliveryStatusBadgeProps) => (
  <span className={`rider-status-badge rider-status-${status.toLowerCase().replaceAll('_', '-')}`}>
    <span />{labels[status] ?? status.replaceAll('_', ' ').toLowerCase()}
  </span>
)

export default DeliveryStatusBadge