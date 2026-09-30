import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { formatNaira } from '../../features/ordering/utils'

const Orders = () => {
  const orders = useSelector((state: RootState) => state.ordering.orders)

  return (
    <main className="ordering-page">
      <header className="simple-page-heading">
        <p className="eyebrow">Your past orders</p>
        <h1>Order history</h1>
      </header>
      {orders.length === 0 ? (
        <section className="empty-state">
          <h2>No orders yet</h2>
          <p>Your completed and current orders will appear here.</p>
          <Link className="button-primary" to="/menu">Explore the menu</Link>
        </section>
      ) : (
        <section className="order-history-list">
          {orders.map((order) => (
            <article key={order.id} className="order-history-card">
              <div className="history-card-top">
                <div><p className="eyebrow">{order.id}</p><h2>{new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</h2></div>
                <span className="history-status">{order.status.replaceAll('_', ' ').toLowerCase()}</span>
              </div>
              <p className="history-items">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</p>
              <div className="history-card-bottom">
                <strong>{formatNaira(order.total)}</strong>
                <Link to={`/order/${order.id}`} className="button-outline">View order</Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default Orders