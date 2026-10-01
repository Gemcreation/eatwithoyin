import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store'
import { setOrderStatus } from '../../features/ordering/orderingSlice'
import type { CustomerOrder, OrderStatus } from '../../features/ordering/types'
import { formatNaira } from '../../features/ordering/utils'
import OrderStatusBadge from './OrderStatusBadge'

interface KitchenOrderCardProps {
  order: CustomerOrder
}

const nextStatus: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  ORDER_PLACED: { label: 'Accept order', status: 'CONFIRMED' },
  CONFIRMED: { label: 'Start preparing', status: 'PREPARING' },
  PREPARING: { label: 'Mark ready for pickup', status: 'READY_FOR_PICKUP' },
}

const KitchenOrderCard = ({ order }: KitchenOrderCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const action = nextStatus[order.status]
  const time = new Date(order.createdAt).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)

  return (
    <article className="kitchen-order-card">
      <header className="kitchen-order-card-header">
        <div><p className="kitchen-order-id">#{order.id}</p><OrderStatusBadge status={order.status} /></div>
        <time dateTime={order.createdAt}>{time}</time>
      </header>
      <div className="kitchen-order-customer">
        <strong>{order.customer.fullName}</strong>
        <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
      </div>
      <ul className="kitchen-order-preview">
        {order.items.slice(0, 3).map((item) => <li key={item.foodId}>{item.name} <span>× {item.quantity}</span></li>)}
        {order.items.length > 3 && <li className="kitchen-more-items">+{order.items.length - 3} more items</li>}
      </ul>
      <footer className="kitchen-order-card-footer">
        <strong>{formatNaira(order.total)}</strong>
        <div className="kitchen-order-actions">
          {order.status === 'ORDER_PLACED' && (
            <button type="button" className="kitchen-text-action reject-action" onClick={() => dispatch(setOrderStatus({ orderId: order.id, status: 'CANCELLED' }))}>Reject</button>
          )}
          {action
            ? <button type="button" className="kitchen-action-button" onClick={() => dispatch(setOrderStatus({ orderId: order.id, status: action.status }))}>{action.label}</button>
            : order.status === 'READY_FOR_PICKUP' && <span className="waiting-rider-label">Waiting for rider</span>}
          <Link to={`/kitchen/orders/${order.id}`} className="kitchen-view-link">View</Link>
        </div>
      </footer>
    </article>
  )
}

export default KitchenOrderCard