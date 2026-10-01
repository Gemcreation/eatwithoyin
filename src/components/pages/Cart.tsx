import { Link } from 'react-router-dom'
import { Delete01Icon } from 'hugeicons-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { removeFromCart, setCartQuantity } from '../../features/ordering/orderingSlice'
import { formatNaira } from '../../features/ordering/utils'
import CartSummary from '../ordering/CartSummary'
import QuantitySelector from '../ordering/QuantitySelector'

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cart: items, kitchenSettings } = useSelector((state: RootState) => state.ordering)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <main className="ordering-page">
      <header className="simple-page-heading">
        <p className="eyebrow">Your selection</p>
        <h1>Shopping cart</h1>
      </header>
      {items.length === 0 ? (
        <section className="empty-state">
          <h2>Your cart is waiting for something delicious.</h2>
          <p>Browse the menu and add a meal to get started.</p>
          <Link className="button-primary" to="/menu">Browse menu</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Items in your cart">
            {items.map((item) => (
              <article key={item.foodId} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-main">
                  <h2>{item.name}</h2>
                  <p>{formatNaira(item.price)} each</p>
                  <QuantitySelector quantity={item.quantity} label={`Quantity for ${item.name}`} onChange={(quantity) => dispatch(setCartQuantity({ foodId: item.foodId, quantity }))} />
                </div>
                <strong className="cart-item-subtotal">{formatNaira(item.price * item.quantity)}</strong>
                <button type="button" className="icon-button remove-item-button" aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeFromCart(item.foodId))}>
                  <Delete01Icon size={19} />
                </button>
              </article>
            ))}
            <Link to="/menu" className="text-link continue-shopping">Continue shopping</Link>
          </section>
          <CartSummary subtotal={subtotal} buttonLabel="Proceed to checkout" to="/checkout" deliveryFee={kitchenSettings.deliveryFee} />
        </div>
      )}
    </main>
  )
}

export default Cart