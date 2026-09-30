import { Link } from 'react-router-dom'
import { DELIVERY_FEE, formatNaira } from '../../features/ordering/utils'

interface CartSummaryProps {
  subtotal: number
  buttonLabel: string
  to: string
  disabled?: boolean
}

const CartSummary = ({ subtotal, buttonLabel, to, disabled = false }: CartSummaryProps) => (
  <section className="order-summary">
    <h2>Order summary</h2>
    <div className="summary-line"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
    <div className="summary-line"><span>Delivery fee</span><strong>{formatNaira(DELIVERY_FEE)}</strong></div>
    <div className="summary-total"><span>Total</span><strong>{formatNaira(subtotal + DELIVERY_FEE)}</strong></div>
    {disabled
      ? <button className="button-primary full-button" type="button" disabled>{buttonLabel}</button>
      : <Link className="button-primary full-button" to={to}>{buttonLabel}</Link>}
    <p className="summary-note">Delivery fee is a flat mock rate for this prototype.</p>
  </section>
)

export default CartSummary