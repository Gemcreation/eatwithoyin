import { Tick01Icon } from 'hugeicons-react'
import type { OrderStatus } from '../../features/ordering/types'

const milestones: Array<{ status: OrderStatus; label: string }> = [
  { status: 'ORDER_PLACED', label: 'Order placed' },
  { status: 'CONFIRMED', label: 'Kitchen confirmed' },
  { status: 'PREPARING', label: 'Preparing your food' },
  { status: 'READY_FOR_PICKUP', label: 'Ready for pickup' },
  { status: 'RIDER_ASSIGNED', label: 'Rider assigned' },
  { status: 'PICKED_UP', label: 'Order picked up' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
]

interface OrderTimelineProps {
  status: OrderStatus
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  if (status === 'CANCELLED') {
    return (
      <section className="timeline-panel">
        <h2>Order cancelled</h2>
        <p className="prototype-note">This mock order was declined by the kitchen.</p>
      </section>
    )
  }

  const activeIndex = milestones.findIndex((milestone) => milestone.status === status)

  return (
    <section className="timeline-panel">
      <h2>Order progress</h2>
      <ol className="order-timeline">
        {milestones.map((milestone, index) => {
          const complete = index < activeIndex
          const current = index === activeIndex
          return (
            <li key={milestone.status} className={`${complete ? 'is-complete' : ''} ${current ? 'is-current' : ''}`}>
              <span className="timeline-marker">{complete ? <Tick01Icon size={15} /> : index + 1}</span>
              <span>{milestone.label}</span>
              {current && <span className="timeline-current-label">Current</span>}
            </li>
          )
        })}
      </ol>
      <p className="prototype-note">Prototype status only. Progress updates are not live, and no rider has been assigned.</p>
    </section>
  )
}

export default OrderTimeline