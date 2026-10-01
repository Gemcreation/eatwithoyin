import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { resetDemoOrders, saveDemoOrder } from '../../features/ordering/orderingSlice'
import type { OrderStatus } from '../../features/ordering/types'
import { buildDemoOrder, findDemoOrder } from '../../features/rider/demoScenario'

interface Feedback {
  kind: 'success' | 'error' | 'info'
  message: string
}

const walkthroughSteps = ['Customer', 'Kitchen', 'Rider', 'Customer'] as const

const getActiveStep = (status: OrderStatus) => {
  if (status === 'ORDER_PLACED') return 0
  if (status === 'CONFIRMED' || status === 'PREPARING' || status === 'CANCELLED') return 1
  if (status === 'DELIVERED') return 3
  return 2
}

const getStepPath = (role: typeof walkthroughSteps[number], orderId: string) => {
  if (role === 'Kitchen') return `/kitchen/orders/${orderId}`
  if (role === 'Rider') return `/rider/deliveries/${orderId}`
  return `/order/${orderId}`
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

      <section className="rider-demo-walkthrough" aria-labelledby="rider-walkthrough-heading">
        <header className="rider-demo-walkthrough-header">
          <div><h3 id="rider-walkthrough-heading">Demo walkthrough</h3><p>Follow one order through each role.</p></div>
          {demoOrder && <span className="rider-demo-current-role">Current role <strong>{demoOrder.status === 'DELIVERED' ? 'Customer · complete' : walkthroughSteps[getActiveStep(demoOrder.status)]}</strong></span>}
        </header>

        {demoOrder ? (
          <>
            <div className="rider-demo-status-line">
              <div><small>Demo order</small><strong>#{demoOrder.id}</strong></div>
              <div><small>Current status</small><strong className="rider-demo-status-text">{demoOrder.status.replaceAll('_', ' ')}</strong></div>
            </div>
            <ol className="rider-demo-steps" aria-label="Demo order lifecycle">
              {walkthroughSteps.map((role, index) => {
                const activeStep = getActiveStep(demoOrder.status)
                const complete = demoOrder.status === 'DELIVERED' || index < activeStep
                const active = demoOrder.status !== 'DELIVERED' && index === activeStep
                return (
                  <li key={`${role}-${index}`} className={`rider-demo-step ${complete ? 'is-complete' : ''} ${active ? 'is-active' : ''}`}>
                    <span className="rider-demo-step-marker" aria-hidden="true">{complete ? '✓' : active ? '●' : '○'}</span>
                    <Link to={getStepPath(role, demoOrder.id)}>{role}</Link>
                    {index < walkthroughSteps.length - 1 && <span className="rider-demo-step-arrow" aria-hidden="true">↓</span>}
                  </li>
                )
              })}
            </ol>
            {demoOrder.status === 'DELIVERED' && <p className="rider-demo-complete-message">Demo complete. The order was delivered; open Customer to verify its final status.</p>}
            {demoOrder.status === 'CANCELLED' && <p className="rider-demo-cancelled-message">This demo order was cancelled in Kitchen and cannot continue to Rider.</p>}
          </>
        ) : (
          <div className="rider-demo-walkthrough-empty"><strong>No active demo order.</strong><p>Create a demo order above to preview Customer → Kitchen → Rider → Customer.</p></div>
        )}
      </section>

      <p className="rider-demo-reset-note">Reset removes only the demo order. Customer-created orders are not changed.</p>
      {feedback && <p className={`rider-demo-feedback is-${feedback.kind}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
    </section>
  )
}

export default DemoScenarioTools