import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { getCompletedDeliveries } from '../../../features/rider/data'
import { formatNaira } from '../../../features/ordering/utils'
import DeliveryStatusBadge from '../../rider/DeliveryStatusBadge'

const RiderHistory = () => {
  const orders = useSelector((state: RootState) => state.ordering.orders)
  const completed = [...getCompletedDeliveries(orders)].sort((first, second) => second.createdAt.localeCompare(first.createdAt))

  return (
    <div className="rider-page">
      <header className="rider-page-heading"><div><p className="rider-eyebrow">Completed work</p><h1>Delivery history</h1><p>Orders completed by this demo rider.</p></div><span className="rider-count-label">{completed.length} completed</span></header>
      {completed.length > 0 ? (
        <section className="rider-history-list" aria-label="Completed deliveries">
          {completed.map((order) => (
            <article className="rider-history-card" key={order.id}>
              <div className="rider-history-main"><strong>#{order.id} · {order.customer.fullName}</strong><p>{order.deliveryAddress.address}, {order.deliveryAddress.city}</p><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</time></div>
              <DeliveryStatusBadge status={order.status} />
              <strong className="rider-history-earning">{formatNaira(order.deliveryFee)}<small> mock earning</small></strong>
              <Link to={`/rider/deliveries/${order.id}`} className="rider-secondary-link">View details</Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="rider-empty-state"><h2>No completed deliveries yet</h2><p>Completed deliveries will appear here.</p></section>
      )}
    </div>
  )
}

export default RiderHistory