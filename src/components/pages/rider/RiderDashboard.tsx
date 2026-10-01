import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { getActiveDeliveries, getAvailableDeliveries, getCompletedDeliveriesToday } from '../../../features/rider/data'
import { formatNaira } from '../../../features/ordering/utils'
import ActiveDeliveryCard from '../../rider/ActiveDeliveryCard'
import DeliveryCard from '../../rider/DeliveryCard'
import DemoScenarioTools from '../../rider/DemoScenarioTools'
import RiderAvailabilityToggle from '../../rider/RiderAvailabilityToggle'

const RiderDashboard = () => {
  const { orders, kitchenSettings, riderOnline } = useSelector((state: RootState) => state.ordering)
  const available = getAvailableDeliveries(orders, riderOnline)
  const active = getActiveDeliveries(orders)
  const completedToday = getCompletedDeliveriesToday(orders)
  const earningsToday = completedToday.reduce((sum, order) => sum + order.deliveryFee, 0)
  const metrics = [
    { label: 'Available deliveries', value: available.length },
    { label: 'Active deliveries', value: active.length },
    { label: 'Completed today', value: completedToday.length },
    { label: "Today's earnings · mock", value: formatNaira(earningsToday), money: true },
  ]

  return (
    <div className="rider-page">
      <header className="rider-page-heading"><div><p className="rider-eyebrow">Rider dashboard</p><h1>Ready for your next delivery?</h1><p>Available orders appear after Oyin's Kitchen prepares them.</p></div><Link to="/rider/deliveries" className="rider-secondary-link">All deliveries</Link></header>
      <section className="rider-stat-grid" aria-label="Rider delivery summary">
        {metrics.map((metric) => <article key={metric.label} className={`rider-stat-card ${'money' in metric && metric.money ? 'earnings-stat' : ''}`}><span>{metric.label}</span><strong>{metric.value}</strong></article>)}
      </section>
      <RiderAvailabilityToggle />
      <DemoScenarioTools />

      {active.length > 0 && (
        <section className="rider-section">
          <header className="rider-section-heading"><h2>Active delivery</h2></header>
          <div className="rider-delivery-grid">{active.map((order) => <ActiveDeliveryCard key={order.id} order={order} kitchen={kitchenSettings} />)}</div>
        </section>
      )}

      <section className="rider-section">
        <header className="rider-section-heading"><h2>Available deliveries</h2><Link to="/rider/deliveries">See all</Link></header>
        {available.length > 0
          ? <div className="rider-delivery-grid">{available.slice(0, 2).map((order) => <DeliveryCard key={order.id} order={order} kitchenName={kitchenSettings.name} kitchenAddress={kitchenSettings.address} />)}</div>
          : <div className="rider-empty-state"><h2>{riderOnline ? 'No deliveries available' : "You're offline"}</h2><p>{riderOnline ? 'There are currently no orders ready for pickup.' : "Turn your rider status online when you're ready to receive deliveries."}</p></div>}
      </section>
    </div>
  )
}

export default RiderDashboard