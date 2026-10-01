import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../app/store'
import { assignRiderToOrder, setOrderStatus } from '../../../features/ordering/orderingSlice'
import type { OrderStatus } from '../../../features/ordering/types'
import { mockRider } from '../../../features/rider/data'
import { formatNaira } from '../../../features/ordering/utils'
import DeliveryStatusBadge from '../../rider/DeliveryStatusBadge'

const nextAction: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  RIDER_ASSIGNED: { label: "I've picked up the order", status: 'PICKED_UP' },
  PICKED_UP: { label: 'Start delivery', status: 'OUT_FOR_DELIVERY' },
  OUT_FOR_DELIVERY: { label: 'Mark as delivered', status: 'DELIVERED' },
}

const RiderDeliveryDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { orders, kitchenSettings, riderOnline } = useSelector((state: RootState) => state.ordering)
  const order = orders.find((item) => item.id === id)

  if (!order) {
    return <section className="rider-empty-state"><h2>Delivery not found</h2><p>This order is not in the saved frontend order list.</p><Link to="/rider/deliveries" className="rider-secondary-link">Back to deliveries</Link></section>
  }

  const action = nextAction[order.status]
  const destination = `${order.deliveryAddress.address}, ${order.deliveryAddress.city}`
  const isDelivered = order.status === 'DELIVERED'
  const accept = () => dispatch(assignRiderToOrder({ orderId: order.id, rider: mockRider }))
  const progress = (status: OrderStatus) => dispatch(setOrderStatus({ orderId: order.id, status }))

  return (
    <div className="rider-page">
      <Link to="/rider/deliveries" className="rider-detail-back">← All deliveries</Link>
      <header className="rider-page-heading rider-detail-heading">
        <div><p className="rider-eyebrow">Delivery details</p><h1>#{order.id}</h1><p>Order placed {new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
        <DeliveryStatusBadge status={order.status} />
      </header>

      {order.status === 'DELIVERED' && (
        <section className="rider-completion-panel delivery-completion">
          <span className="rider-completion-mark" aria-hidden="true">✓</span>
          <h2>Delivery completed</h2>
          <p>Order #{order.id} was delivered to {order.customer.fullName}.<br />{formatNaira(order.total)} · Cash on Delivery · Payment collected (mock)</p>
          <Link to="/rider" className="rider-primary-button">Back to dashboard</Link>
        </section>
      )}

      <div className="rider-detail-layout">
        <div className="rider-detail-main">
          <section className="rider-panel">
            <header className="rider-panel-heading"><h2>Order items</h2><span>{order.items.reduce((count, item) => count + item.quantity, 0)} items</span></header>
            <div className="rider-item-list">
              {order.items.map((item) => <div className="rider-item-row" key={item.foodId}><span>{item.name}</span><span>× {item.quantity}</span><strong>{formatNaira(item.price * item.quantity)}</strong></div>)}
            </div>
            <div className="rider-item-total"><span>Order total</span><strong>{formatNaira(order.total)}</strong></div>
          </section>

          <section className="rider-panel">
            <header className="rider-panel-heading"><h2>Pickup and delivery</h2></header>
            <div className="rider-address-block"><h3>Pickup</h3><strong>{kitchenSettings.name}</strong><p>{kitchenSettings.address}</p></div>
            <div className="rider-address-block"><h3>Delivery destination</h3><strong>{order.customer.fullName}</strong><p>{order.deliveryAddress.address}</p>{order.deliveryAddress.landmark && <p>Near {order.deliveryAddress.landmark}</p>}<p>{order.deliveryAddress.city}</p><a href={`tel:${order.customer.phone}`} className="rider-contact-link">Customer · {order.customer.phone}</a></div>
          </section>
        </div>

        <aside className="rider-detail-aside">
          <section className="rider-panel">
            <header className="rider-panel-heading"><h2>Payment</h2></header>
            <div className="rider-payment-info"><div><span>Method</span><strong>{order.paymentMethod}</strong></div><div><span>Status</span><strong className="rider-simulated-label">{isDelivered ? 'Collected · mock' : 'Pending · mock'}</strong></div></div>
          </section>
          <section className="rider-action-panel">
            <h2>{isDelivered ? 'Delivery completed' : order.status === 'OUT_FOR_DELIVERY' ? 'Out for delivery' : order.status === 'PICKED_UP' ? 'Order picked up' : order.status === 'RIDER_ASSIGNED' ? 'Pickup next' : 'Delivery action'}</h2>
            <p>{isDelivered ? `Delivered to ${order.customer.fullName} · ${destination}. Payment collected (mock).` : order.status === 'RIDER_ASSIGNED' ? `Pick up from ${kitchenSettings.name}.` : order.status === 'PICKED_UP' ? `Destination: ${destination}` : order.status === 'OUT_FOR_DELIVERY' ? `Delivering to ${order.customer.fullName} · ${destination}` : order.status === 'READY_FOR_PICKUP' ? `This delivery is ready at ${kitchenSettings.name}.` : order.status === 'CANCELLED' ? 'This order was cancelled and cannot be delivered.' : 'This order is not ready for rider pickup yet.'}</p>
            {order.status === 'READY_FOR_PICKUP' && <button type="button" className="rider-main-action" disabled={!riderOnline} onClick={accept}>{riderOnline ? 'Accept delivery' : 'Go online to accept'}</button>}
            {action && <button type="button" className="rider-main-action" onClick={() => progress(action.status)}>{action.label}</button>}
            {order.status === 'DELIVERED' && <Link to="/rider/history" className="rider-main-action">View delivery history</Link>}
            {order.status === 'CANCELLED' && <Link to="/rider/deliveries" className="rider-secondary-link">Back to deliveries</Link>}
          </section>
        </aside>
      </div>
    </div>
  )
}

export default RiderDeliveryDetails