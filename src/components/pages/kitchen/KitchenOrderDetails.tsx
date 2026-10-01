import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../app/store'
import { setOrderStatus } from '../../../features/ordering/orderingSlice'
import type { OrderStatus } from '../../../features/ordering/types'
import { formatNaira } from '../../../features/ordering/utils'
import OrderStatusBadge from '../../kitchen/OrderStatusBadge'

const kitchenStages: Array<{ status: OrderStatus; label: string }> = [
  { status: 'ORDER_PLACED', label: 'Order placed' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'PREPARING', label: 'Preparing' },
  { status: 'READY_FOR_PICKUP', label: 'Ready for pickup' },
]

const nextAction: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  ORDER_PLACED: { label: 'Accept order', status: 'CONFIRMED' },
  CONFIRMED: { label: 'Start preparing', status: 'PREPARING' },
  PREPARING: { label: 'Mark ready for pickup', status: 'READY_FOR_PICKUP' },
}

const KitchenOrderDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const order = useSelector((state: RootState) => state.ordering.orders.find((item) => item.id === id))

  if (!order) {
    return <section className="kitchen-empty-state"><h1>Order not found</h1><p>This order is not in the saved frontend order list.</p><Link to="/kitchen/orders" className="kitchen-secondary-link">Back to orders</Link></section>
  }

  const currentStage = kitchenStages.findIndex((stage) => stage.status === order.status)
  const action = nextAction[order.status]
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)
  const changeStatus = (status: OrderStatus) => dispatch(setOrderStatus({ orderId: order.id, status }))

  return (
    <div className="kitchen-page">
      <Link to="/kitchen/orders" className="kitchen-back-link">← All orders</Link>
      <header className="kitchen-page-heading order-details-heading">
        <div><p className="kitchen-eyebrow">Order details</p><h1>#{order.id}</h1><p>{new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })} · {itemCount} {itemCount === 1 ? 'item' : 'items'}</p></div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="kitchen-details-layout">
        <div className="kitchen-details-main">
          <section className="kitchen-panel">
            <header className="kitchen-panel-heading"><h2>Order items</h2><span>{itemCount} total</span></header>
            <div className="kitchen-items-table" role="table" aria-label="Order items">
              <div className="kitchen-items-row table-heading" role="row"><span>Item</span><span>Qty</span><span>Unit price</span><span>Subtotal</span></div>
              {order.items.map((item) => (
                <div key={item.foodId} className="kitchen-items-row" role="row">
                  <span className="kitchen-item-name"><img src={item.image} alt="" />{item.name}</span>
                  <span>{item.quantity}</span><span>{formatNaira(item.price)}</span><strong>{formatNaira(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="kitchen-order-total-lines">
              <div><span>Subtotal</span><strong>{formatNaira(order.subtotal)}</strong></div>
              <div><span>Delivery fee</span><strong>{formatNaira(order.deliveryFee)}</strong></div>
              <div className="kitchen-total"><span>Total</span><strong>{formatNaira(order.total)}</strong></div>
            </div>
          </section>

          <section className="kitchen-panel">
            <header className="kitchen-panel-heading"><h2>Kitchen progress</h2></header>
            {order.status === 'CANCELLED' ? <p className="kitchen-cancelled-note">This order was rejected and will not be prepared.</p> : (
              <ol className="kitchen-progress-list">
                {kitchenStages.map((stage, index) => {
                  const complete = currentStage > index || currentStage === -1 && order.status !== 'CANCELLED'
                  const active = currentStage === index
                  return <li key={stage.status} className={`${complete ? 'is-complete' : ''} ${active ? 'is-current' : ''}`}><span>{complete ? '✓' : index + 1}</span>{stage.label}</li>
                })}
              </ol>
            )}
          </section>
        </div>

        <aside className="kitchen-details-aside">
          <section className="kitchen-panel customer-panel">
            <header className="kitchen-panel-heading"><h2>Customer</h2></header>
            <strong>{order.customer.fullName}</strong>
            <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>
            <div className="kitchen-address"><h3>Delivery address</h3><p>{order.deliveryAddress.address}</p>{order.deliveryAddress.landmark && <p>Near {order.deliveryAddress.landmark}</p>}<p>{order.deliveryAddress.city}</p></div>
          </section>
          <section className="kitchen-panel payment-panel">
            <header className="kitchen-panel-heading"><h2>Payment</h2></header>
            <div><span>Method</span><strong>{order.paymentMethod}</strong></div>
            <div><span>Status</span><strong className="payment-pending">Pending · mock</strong></div>
          </section>
          <section className="kitchen-panel kitchen-action-panel">
            <h2>Order action</h2>
            {action && <button type="button" className="kitchen-action-button" onClick={() => changeStatus(action.status)}>{action.label}</button>}
            {order.status === 'ORDER_PLACED' && <button type="button" className="kitchen-reject-button" onClick={() => changeStatus('CANCELLED')}>Reject order</button>}
            {order.status === 'READY_FOR_PICKUP' && <p className="waiting-rider-label">Waiting for rider. No rider has been assigned.</p>}
            {['DELIVERED', 'CANCELLED'].includes(order.status) && <p className="kitchen-readonly-note">This order is complete and read-only.</p>}
          </section>
        </aside>
      </div>
    </div>
  )
}

export default KitchenOrderDetails