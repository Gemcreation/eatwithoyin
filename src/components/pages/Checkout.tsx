import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { clearCart, saveOrder } from '../../features/ordering/orderingSlice'
import { calculateSubtotal, createNextOrderId, formatNaira } from '../../features/ordering/utils'
import type { CustomerOrder } from '../../features/ordering/types'

interface CheckoutFields {
  fullName: string
  phone: string
  address: string
  landmark: string
  city: string
}

type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>

const emptyFields: CheckoutFields = { fullName: '', phone: '', address: '', landmark: '', city: '' }

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { cart, orders, kitchenSettings } = useSelector((state: RootState) => state.ordering)
  const deliveryFee = kitchenSettings.deliveryFee
  const [fields, setFields] = useState(emptyFields)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const subtotal = calculateSubtotal(cart)

  const updateField = (field: keyof CheckoutFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cart.length === 0) return

    const nextErrors: CheckoutErrors = {}
    if (!fields.fullName.trim()) nextErrors.fullName = 'Enter your full name.'
    if (!fields.phone.trim()) nextErrors.phone = 'Enter a phone number.'
    else if (fields.phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Enter a valid phone number.'
    if (!fields.address.trim()) nextErrors.address = 'Enter your delivery address.'
    if (!fields.city.trim()) nextErrors.city = 'Enter your city.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const order: CustomerOrder = {
      id: createNextOrderId(orders),
      customer: { fullName: fields.fullName.trim(), phone: fields.phone.trim() },
      deliveryAddress: {
        address: fields.address.trim(),
        landmark: fields.landmark.trim(),
        city: fields.city.trim(),
      },
      items: cart.map((item) => ({ ...item })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod: 'Cash on delivery',
      status: 'ORDER_PLACED',
      createdAt: new Date().toISOString(),
    }

    dispatch(saveOrder(order))
    dispatch(clearCart())
    navigate(`/order/${order.id}`)
  }

  if (cart.length === 0) {
    return (
      <main className="ordering-page">
        <section className="empty-state">
          <h1>Your cart is empty</h1>
          <p>Add a meal before continuing to checkout.</p>
          <Link className="button-primary" to="/menu">Browse menu</Link>
        </section>
      </main>
    )
  }

  const fieldError = (field: keyof CheckoutFields) => errors[field] && <span className="field-error">{errors[field]}</span>

  return (
    <main className="ordering-page">
      <header className="simple-page-heading">
        <p className="eyebrow">Almost there</p>
        <h1>Delivery details</h1>
      </header>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder} noValidate>
          <section className="form-section">
            <h2>Customer information</h2>
            <label className="form-field">
              Full name
              <input autoComplete="name" value={fields.fullName} aria-invalid={Boolean(errors.fullName)} onChange={(event) => updateField('fullName', event.target.value)} />
              {fieldError('fullName')}
            </label>
            <label className="form-field">
              Phone number
              <input type="tel" autoComplete="tel" value={fields.phone} aria-invalid={Boolean(errors.phone)} onChange={(event) => updateField('phone', event.target.value)} />
              {fieldError('phone')}
            </label>
          </section>

          <section className="form-section">
            <h2>Delivery address</h2>
            <label className="form-field">
              Street address
              <textarea autoComplete="street-address" rows={3} value={fields.address} aria-invalid={Boolean(errors.address)} onChange={(event) => updateField('address', event.target.value)} />
              {fieldError('address')}
            </label>
            <label className="form-field">
              Landmark <span className="optional-label">Optional</span>
              <input value={fields.landmark} onChange={(event) => updateField('landmark', event.target.value)} />
            </label>
            <label className="form-field">
              City
              <input autoComplete="address-level2" value={fields.city} aria-invalid={Boolean(errors.city)} onChange={(event) => updateField('city', event.target.value)} />
              {fieldError('city')}
            </label>
          </section>

          <section className="form-section payment-section">
            <h2>Payment</h2>
            <label className="payment-choice">
              <input type="radio" name="payment" checked readOnly />
              <span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span>
            </label>
          </section>
          <button type="submit" className="button-primary full-button">Place order · {formatNaira(subtotal + deliveryFee)}</button>
        </form>

        <aside className="checkout-order-summary">
          <h2>Your order</h2>
          <div className="checkout-items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.foodId}>
                <img src={item.image} alt="" />
                <div><strong>{item.name}</strong><span>Qty {item.quantity}</span></div>
                <strong>{formatNaira(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-line"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
          <div className="summary-line"><span>Delivery fee</span><strong>{formatNaira(deliveryFee)}</strong></div>
          <div className="summary-total"><span>Total</span><strong>{formatNaira(subtotal + deliveryFee)}</strong></div>
        </aside>
      </div>
    </main>
  )
}

export default Checkout