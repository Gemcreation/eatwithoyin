import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { setRiderOnline } from '../../features/ordering/orderingSlice'

const RiderAvailabilityToggle = () => {
  const dispatch = useDispatch<AppDispatch>()
  const online = useSelector((state: RootState) => state.ordering.riderOnline)

  return (
    <section className="rider-availability-card">
      <div className="rider-availability-copy">
        <span className={`rider-availability-dot ${online ? '' : 'is-offline'}`} />
        <span><strong>You're {online ? 'online' : 'offline'}</strong><small>{online ? 'Ready-for-pickup deliveries are visible.' : "You're offline. New deliveries won't be shown."}</small></span>
      </div>
      <label className="rider-toggle">
        <input type="checkbox" checked={online} onChange={(event) => dispatch(setRiderOnline(event.target.checked))} aria-label="Rider online" />
        <span />
      </label>
    </section>
  )
}

export default RiderAvailabilityToggle