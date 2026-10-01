import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { resetDemoOrders, saveDemoOrder } from '../../features/ordering/orderingSlice'
import { buildDemoOrder, findDemoOrder } from '../../features/rider/demoScenario'

interface Feedback {
  kind: 'success' | 'error' | 'info'
  message: string
}

const DemoScenarioTools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { orders, foods, kitchenSettings } = useSelector((state: RootState) => state.ordering)
  const demoOrder = findDemoOrder(orders)
  const [processing, setProcessing] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const processingRef = useRef(false)

  const createDemoOrder = async () => {
    if (processingRef.current) return
    processingRef.current = true
    setProcessing(true)
    setFeedback(null)

    try {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
      const existingDemo = findDemoOrder(orders)
      if (existingDemo) {
        setFeedback({ kind: 'info', message: `Demo order #${existingDemo.id} already exists. Reset it before creating another.` })
        return
      }

      const order = buildDemoOrder({ orders, foods, kitchenSettings })
      dispatch(saveDemoOrder(order))
      setFeedback({ kind: 'success', message: `Demo order #${order.id} created. The same order is now available in Customer, Kitchen, and Rider views.` })
    } catch (error) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'Could not create a demo order.' })
    } finally {
      processingRef.current = false
      setProcessing(false)
    }
  }

  const resetDemo = async () => {
    if (!demoOrder || processingRef.current) return
    processingRef.current = true
    setProcessing(true)
    setFeedback(null)
    try {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
      dispatch(resetDemoOrders())
      setFeedback({ kind: 'success', message: `Demo scenario reset. Order #${demoOrder.id} was removed; other orders were kept.` })
    } catch (error) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'Could not reset the demo scenario.' })
    } finally {
      processingRef.current = false
      setProcessing(false)
    }
  }

  return (
    <section className="rider-demo-tools" aria-labelledby="rider-demo-tools-heading">
      <header className="rider-demo-tools-header">
        <div><p className="rider-eyebrow">Reviewer utility</p><h2 id="rider-demo-tools-heading">Demo tools</h2><p>Create one shared mock order for the complete three-role workflow.</p></div>
        {demoOrder && <span className="rider-demo-order-tag">#{demoOrder.id} · {demoOrder.status.replaceAll('_', ' ').toLowerCase()}</span>}
      </header>

      {!demoOrder ? (
        <div className="rider-demo-tools-actions">
          <button type="button" className="rider-primary-button" disabled={processing} onClick={createDemoOrder}>{processing ? 'Creating demo order…' : 'Create Demo Order'}</button>
          <button type="button" className="rider-secondary-button" disabled title="There is no demo order to reset">Reset Demo</button>
        </div>
      ) : (
        <div className="rider-demo-existing">
          <p>One shared demo order is already saved. Continue the scenario using this order, or reset it to start again.</p>
          <div className="rider-demo-order-links">
            <Link to={`/order/${demoOrder.id}`}>Customer tracking</Link>
            <Link to={`/kitchen/orders/${demoOrder.id}`}>Kitchen order</Link>
            <Link to={`/rider/deliveries/${demoOrder.id}`}>Rider delivery</Link>
          </div>
          <button type="button" className="rider-secondary-button" disabled={processing} onClick={resetDemo}>{processing ? 'Resetting…' : 'Reset Demo'}</button>
        </div>
      )}

      <p className="rider-demo-reset-note">Reset removes only the demo order. Customer-created orders are not changed.</p>
      {feedback && <p className={`rider-demo-feedback is-${feedback.kind}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
    </section>
  )
}

export default DemoScenarioTools