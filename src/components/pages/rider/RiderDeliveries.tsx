import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../app/store'
import { assignRiderToOrder } from '../../../features/ordering/orderingSlice'
import { getActiveDeliveries, getAvailableDeliveries } from '../../../features/rider/data'
import { mockRider } from '../../../features/rider/data'
import ActiveDeliveryCard from '../../rider/ActiveDeliveryCard'
import DeliveryCard from '../../rider/DeliveryCard'
import RiderAvailabilityToggle from '../../rider/RiderAvailabilityToggle'

const RiderDeliveries = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { orders, kitchenSettings, riderOnline } = useSelector((state: RootState) => state.ordering)
  const available = getAvailableDeliveries(orders, riderOnline)
  const active = getActiveDeliveries(orders)
  const accept = (orderId: string) => dispatch(assignRiderToOrder({ orderId, rider: mockRider }))

  return (
    <div className="rider-page">
      <header className="rider-page-heading"><div><p className="rider-eyebrow">Delivery queue</p><h1>Deliveries</h1><p>Accept a prepared order to begin a mock delivery.</p></div><span className="rider-count-label">{available.length} available</span></header>
      <RiderAvailabilityToggle />
      {active.length > 0 && (
        <section className="rider-section">
          <header className="rider-section-heading"><h2>Your active deliveries</h2></header>
          <div className="rider-delivery-grid">{active.map((order) => <ActiveDeliveryCard key={order.id} order={order} kitchen={kitchenSettings} />)}</div>
        </section>
      )}
      <section className="rider-section">
        <header className="rider-section-heading"><h2>Ready for pickup</h2></header>
        {available.length > 0
          ? <div className="rider-delivery-grid">{available.map((order) => <DeliveryCard key={order.id} order={order} kitchenName={kitchenSettings.name} kitchenAddress={kitchenSettings.address} onAccept={(item) => accept(item.id)} />)}</div>
          : <div className="rider-empty-state"><h2>{riderOnline ? 'No deliveries available' : "You're offline"}</h2><p>{riderOnline ? 'There are currently no orders ready for pickup.' : "You're offline. New deliveries won't be shown."}</p></div>}
      </section>
    </div>
  )
}

export default RiderDeliveries