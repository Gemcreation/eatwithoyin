import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { formatNaira } from '../../../features/ordering/utils'
import KitchenOrderCard from '../../kitchen/KitchenOrderCard'

const KitchenDashboard = () => {
  const { orders } = useSelector((state: RootState) => state.ordering)
  const today = new Date().toDateString()
  const ordersToday = orders.filter((order) => new Date(order.createdAt).toDateString() === today)
  const completedToday = ordersToday.filter((order) => order.status === 'DELIVERED')
  const metrics = [
    { label: 'New orders', value: orders.filter((order) => order.status === 'ORDER_PLACED').length },
    { label: 'Preparing', value: orders.filter((order) => order.status === 'PREPARING').length },
    { label: 'Ready for pickup', value: orders.filter((order) => order.status === 'READY_FOR_PICKUP').length },
    { label: 'Completed today', value: completedToday.length },
    { label: "Today's revenue", value: formatNaira(completedToday.reduce((sum, order) => sum + order.total, 0)), isRevenue: true },
  ]
  const recentOrders = [...orders].sort((first, second) => second.createdAt.localeCompare(first.createdAt)).slice(0, 4)

  return (
    <div className="kitchen-page">
      <header className="kitchen-page-heading">
        <div><p className="kitchen-eyebrow">Kitchen overview</p><h1>Good service starts here.</h1><p>Review incoming orders and keep today's kitchen moving.</p></div>
        <Link to="/kitchen/orders" className="kitchen-primary-link">View all orders</Link>
      </header>

      <section className="kitchen-metrics" aria-label="Kitchen order summary">
        {metrics.map((metric) => (
          <article key={metric.label} className={`kitchen-metric ${'isRevenue' in metric && metric.isRevenue ? 'revenue-metric' : ''}`}>
            <span>{metric.label}</span><strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="kitchen-section">
        <header className="kitchen-section-heading"><div><h2>Recent orders</h2><p>Latest orders submitted by customers</p></div><Link to="/kitchen/orders">Open order manager</Link></header>
        {recentOrders.length > 0 ? (
          <div className="kitchen-order-grid">{recentOrders.map((order) => <KitchenOrderCard key={order.id} order={order} />)}</div>
        ) : (
          <div className="kitchen-empty-state"><h3>No orders yet</h3><p>New customer orders will appear here.</p><Link to="/kitchen/orders">Open order manager</Link></div>
        )}
      </section>
    </div>
  )
}

export default KitchenDashboard