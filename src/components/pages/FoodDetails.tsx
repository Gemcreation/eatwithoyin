import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft01Icon } from 'hugeicons-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { addToCart } from '../../features/ordering/orderingSlice'
import { formatNaira } from '../../features/ordering/utils'
import QuantitySelector from '../ordering/QuantitySelector'

const FoodDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const foods = useSelector((state: RootState) => state.ordering.foods)
  const food = foods.find((item) => item.id === id)
  const [quantity, setQuantity] = useState(1)

  if (!food) {
    return (
      <main className="ordering-page">
        <section className="empty-state">
          <h1>We couldn't find that dish</h1>
          <p>This menu item may have moved or no longer exists.</p>
          <Link className="button-primary" to="/menu">Back to menu</Link>
        </section>
      </main>
    )
  }

  const handleAdd = () => {
    dispatch(addToCart({ foodId: food.id, name: food.name, image: food.image, price: food.price, quantity }))
    navigate('/cart')
  }

  return (
    <main className="ordering-page">
      <Link to="/menu" className="back-link"><ArrowLeft01Icon size={18} /> Back to menu</Link>
      <article className="food-detail-layout">
        <div className="food-detail-image-wrap">
          <img src={food.image} alt={food.name} className="food-detail-image" />
        </div>
        <div className="food-detail-content">
          <span className={`availability-pill ${food.available ? 'is-available' : 'is-unavailable'}`}>
            {food.available ? 'Available to order' : 'Currently unavailable'}
          </span>
          <p className="menu-food-category">{food.category}</p>
          <h1>{food.name}</h1>
          <p className="food-detail-description">{food.description}</p>
          <strong className="food-detail-price">{formatNaira(food.price)}</strong>
          {food.available ? (
            <div className="food-detail-buy-row">
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
              <button type="button" className="button-primary" onClick={handleAdd}>Add to cart</button>
            </div>
          ) : (
            <button type="button" className="button-primary" disabled>Unavailable right now</button>
          )}
        </div>
      </article>
    </main>
  )
}

export default FoodDetails