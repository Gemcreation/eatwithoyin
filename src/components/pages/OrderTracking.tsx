import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import OrderTimeline from '../ordering/OrderTimeline'
import { formatNaira } from '../../features/ordering/utils'

const OrderTracking = () => {
  const { id } = useParams()
  const order = useSelector((state: RootState) => state.ordering.orders.find((item) => item.id === id))

  if (!order) {
    return (
      <main className="ordering-page">
        <section className="empty-state">
          <h1>Order not found</h1>
          <p>We couldn't find that order in this browser's saved order history.</p>
          <Link className="button-primary" to="/orders">View order history</Link>
        </section>
      </main>
    )
  }

  const created = new Date(order.createdAt)

  return (
    <main className="ordering-page">
      <header className="tracking-header">
        <div>
          <p className="eyebrow">Thanks, {order.customer.fullName.split(' ')[0]}</p>
          <h1>Order {order.id}</h1>
          <p>Placed {created.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
        <Link to="/orders" className="button-outline">Order history</Link>
      </header>
      <div className="tracking-layout">
        <OrderTimeline status={order.status} />
        <aside className="tracking-order-card">
          <h2>Order details</h2>
          {order.items.map((item) => (
            <div key={item.foodId} className="tracking-item">
              <span>{item.quantity} × {item.name}</span>
              <strong>{formatNaira(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-line"><span>Delivery fee</span><strong>{formatNaira(order.deliveryFee)}</strong></div>
          <div className="summary-total"><span>Total</span><strong>{formatNaira(order.total)}</strong></div>
          <div className="delivery-address-block">
            <h3>Delivering to</h3>
            <p>{order.deliveryAddress.address}</p>
            {order.deliveryAddress.landmark && <p>Near {order.deliveryAddress.landmark}</p>}
            <p>{order.deliveryAddress.city}</p>
            <p>{order.customer.phone}</p>
          </div>
          {order.rider && (
            <div className="delivery-address-block">
              <h3>Delivery rider</h3>
              <p>{order.rider.name} · {order.rider.id}</p>
              <p>{order.rider.phone}</p>
            </div>
          )}
          <p className="payment-hint">{order.paymentMethod}</p>
        </aside>
      </div>
    </main>
  )
}

export default OrderTracking