import type { OrderStatus } from '../../features/ordering/types'

const labels: Record<OrderStatus, string> = {
  ORDER_PLACED: 'New',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for pickup',
  RIDER_ASSIGNED: 'Rider assigned',
  PICKED_UP: 'Picked up',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Completed',
  CANCELLED: 'Cancelled',
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span className={`kitchen-status-badge status-${status.toLowerCase().replaceAll('_', '-')}`}>
    <span className="status-dot" />{labels[status]}
  </span>
)

export default OrderStatusBadge