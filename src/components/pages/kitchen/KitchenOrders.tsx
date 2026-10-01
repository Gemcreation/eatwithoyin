import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import type { CustomerOrder } from '../../../features/ordering/types'
import KitchenOrderCard from '../../kitchen/KitchenOrderCard'

const filters = ['All', 'New', 'Confirmed', 'Preparing', 'Ready for pickup', 'Completed', 'Cancelled'] as const
type OrderFilter = typeof filters[number]

const matchesFilter = (order: CustomerOrder, filter: OrderFilter) => {
  if (filter === 'All') return true
  if (filter === 'New') return order.status === 'ORDER_PLACED'
  if (filter === 'Confirmed') return order.status === 'CONFIRMED'
  if (filter === 'Preparing') return order.status === 'PREPARING'
  if (filter === 'Ready for pickup') return ['READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status)
  if (filter === 'Completed') return order.status === 'DELIVERED'
  return order.status === 'CANCELLED'
}

const KitchenOrders = () => {
  const orders = useSelector((state: RootState) => state.ordering.orders)
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('All')
  const sortedOrders = [...orders].sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  const visibleOrders = sortedOrders.filter((order) => matchesFilter(order, activeFilter))

  return (
    <div className="kitchen-page">
      <header className="kitchen-page-heading">
        <div><p className="kitchen-eyebrow">Kitchen operations</p><h1>Orders</h1><p>Accept incoming orders and move each meal through preparation.</p></div>
        <span className="kitchen-count-label">{orders.length} total {orders.length === 1 ? 'order' : 'orders'}</span>
      </header>
      <nav className="kitchen-order-filters" aria-label="Filter orders by status">
        {filters.map((filter) => {
          const count = sortedOrders.filter((order) => matchesFilter(order, filter)).length
          return <button key={filter} type="button" className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}<span>{count}</span></button>
        })}
      </nav>
      {visibleOrders.length > 0 ? (
        <section className="kitchen-order-grid" aria-label={`${activeFilter} orders`}>
          {visibleOrders.map((order) => <KitchenOrderCard key={order.id} order={order} />)}
        </section>
      ) : (
        <section className="kitchen-empty-state"><h2>{activeFilter === 'All' ? 'No orders yet' : `No ${activeFilter.toLowerCase()} orders`}</h2><p>{activeFilter === 'All' ? 'New customer orders will appear here.' : 'Orders will appear here when their status changes.'}</p></section>
      )}
    </div>
  )
}

export default KitchenOrders