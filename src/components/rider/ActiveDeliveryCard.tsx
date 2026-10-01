import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store'
import { setOrderStatus } from '../../features/ordering/orderingSlice'
import type { CustomerOrder, OrderStatus } from '../../features/ordering/types'
import type { KitchenSettings } from '../../features/ordering/types'
import { formatNaira } from '../../features/ordering/utils'
import DeliveryStatusBadge from './DeliveryStatusBadge'

interface ActiveDeliveryCardProps {
  order: CustomerOrder
  kitchen: KitchenSettings
}

const nextAction: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  RIDER_ASSIGNED: { label: "I've picked up the order", status: 'PICKED_UP' },
  PICKED_UP: { label: 'Start delivery', status: 'OUT_FOR_DELIVERY' },
  OUT_FOR_DELIVERY: { label: 'Mark as delivered', status: 'DELIVERED' },
}

const ActiveDeliveryCard = ({ order, kitchen }: ActiveDeliveryCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const action = nextAction[order.status]
  const destination = `${order.deliveryAddress.address}, ${order.deliveryAddress.city}`

  return (
    <article className="rider-active-card">
      <header className="rider-active-card-header">
        <div><h2>Active delivery · #{order.id}</h2><p>{order.customer.fullName} · {formatNaira(order.total)}</p></div>
        <DeliveryStatusBadge status={order.status} />
      </header>
      <div className="rider-active-route">
        <div className="rider-route-point pickup-point"><span className="route-marker" /><div><small>Pickup</small><strong>{kitchen.name}</strong><p>{kitchen.address}</p></div></div>
        <span className="rider-route-arrow" aria-hidden="true">↓</span>
        <div className="rider-route-point delivery-point"><span className="route-marker" /><div><small>{order.status === 'RIDER_ASSIGNED' ? 'Drop-off' : 'Destination'}</small><strong>{order.customer.fullName}</strong><p>{destination}</p></div></div>
      </div>
      <footer className="rider-active-footer">
        <span>{order.status === 'OUT_FOR_DELIVERY' ? `Customer · ${order.customer.phone}` : `${order.items.reduce((count, item) => count + item.quantity, 0)} items · ${order.paymentMethod}`}</span>
        {action ? (
          <button type="button" className="rider-main-action" onClick={() => {
            dispatch(setOrderStatus({ orderId: order.id, status: action.status }))
            if (action.status === 'DELIVERED') navigate(`/rider/deliveries/${order.id}`)
          }}>{action.label}</button>
        ) : <Link to={`/rider/deliveries/${order.id}`} className="rider-secondary-link">View delivery</Link>}
      </footer>
    </article>
  )
}

export default ActiveDeliveryCard