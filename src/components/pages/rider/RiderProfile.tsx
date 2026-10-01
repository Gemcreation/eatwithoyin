import { useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { getCompletedDeliveries, getCompletedDeliveriesToday } from '../../../features/rider/data'
import { mockRider } from '../../../features/rider/data'
import { formatNaira } from '../../../features/ordering/utils'

const RiderProfile = () => {
  const orders = useSelector((state: RootState) => state.ordering.orders)
  const completed = getCompletedDeliveries(orders)
  const completedToday = getCompletedDeliveriesToday(orders)
  const totalEarnings = completed.reduce((sum, order) => sum + order.deliveryFee, 0)
  const todayEarnings = completedToday.reduce((sum, order) => sum + order.deliveryFee, 0)

  return (
    <div className="rider-page">
      <header className="rider-page-heading"><div><p className="rider-eyebrow">Rider account</p><h1>Profile</h1><p>Mock rider details for the frontend preview.</p></div></header>
      <div className="rider-profile-layout">
        <section className="rider-profile-card">
          <div className="rider-profile-identity"><span className="rider-avatar" aria-hidden="true">{mockRider.name.split(' ').map((part) => part[0]).join('')}</span><div><h2>{mockRider.name}</h2><p>{mockRider.id}</p></div></div>
          <div className="rider-profile-details"><div><span>Phone</span><strong>{mockRider.phone}</strong></div><div><span>Vehicle type</span><strong>{mockRider.vehicleType}</strong></div><div><span>Registration</span><strong>{mockRider.vehicleRegistration}</strong></div><div><span>Profile status</span><strong>Demo profile</strong></div></div>
        </section>
        <section className="rider-profile-card rider-profile-stats">
          <h2>Delivery statistics</h2>
          <div className="rider-profile-stat"><span>Completed deliveries</span><strong>{completed.length}</strong></div>
          <div className="rider-profile-stat"><span>Today's deliveries</span><strong>{completedToday.length}</strong></div>
          <div className="rider-profile-stat"><span>Total mock earnings</span><strong>{formatNaira(totalEarnings)}</strong></div>
          <div className="rider-profile-stat"><span>Today's mock earnings</span><strong>{formatNaira(todayEarnings)}</strong></div>
        </section>
      </div>
    </div>
  )
}

export default RiderProfile