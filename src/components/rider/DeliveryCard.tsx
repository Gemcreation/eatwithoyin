import { Link } from 'react-router-dom'
import type { CustomerOrder } from '../../features/ordering/types'
import { formatNaira } from '../../features/ordering/utils'
import DeliveryStatusBadge from './DeliveryStatusBadge'

interface DeliveryCardProps {
  order: CustomerOrder
  kitchenName: string
  kitchenAddress: string
  onAccept?: (order: CustomerOrder) => void
}

const DeliveryCard = ({ order, kitchenName, kitchenAddress, onAccept }: DeliveryCardProps) => {
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)

  return (
    <article className="rider-delivery-card">
      <header className="rider-delivery-card-header">
        <div><p className="rider-order-id">#{order.id}</p><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span></div>
        <DeliveryStatusBadge status={order.status} />
      </header>
      <div className="rider-route-preview">
        <div className="rider-route-point pickup-point"><span className="route-marker" /><div><small>Pickup</small><strong>{kitchenName}</strong><p>{kitchenAddress}</p></div></div>
        <div className="route-connector" />
        <div className="rider-route-point delivery-point"><span className="route-marker" /><div><small>Deliver to</small><strong>{order.customer.fullName}</strong><p>{order.deliveryAddress.address}, {order.deliveryAddress.city}</p></div></div>
      </div>
      <footer className="rider-delivery-card-footer">
        <strong>{formatNaira(order.total)}</strong>
        <div><Link to={`/rider/deliveries/${order.id}`} className="rider-secondary-link">View delivery</Link>{onAccept && <button type="button" className="rider-primary-button" onClick={() => onAccept(order)}>Accept delivery</button>}</div>
      </footer>
    </article>
  )
}

export default DeliveryCard