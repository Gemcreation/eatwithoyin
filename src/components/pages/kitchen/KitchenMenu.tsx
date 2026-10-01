import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../app/store'
import { toggleFoodAvailability } from '../../../features/ordering/orderingSlice'
import { formatNaira } from '../../../features/ordering/utils'

const KitchenMenu = () => {
  const dispatch = useDispatch<AppDispatch>()
  const foods = useSelector((state: RootState) => state.ordering.foods)

  return (
    <div className="kitchen-page">
      <header className="kitchen-page-heading">
        <div><p className="kitchen-eyebrow">Kitchen catalogue</p><h1>Menu</h1><p>Manage the meals customers can browse and order.</p></div>
        <Link to="/kitchen/menu/new" className="kitchen-primary-link">Add food</Link>
      </header>
      {foods.length > 0 ? (
        <section className="kitchen-menu-grid" aria-label="Kitchen menu items">
          {foods.map((food) => (
            <article className="kitchen-menu-card" key={food.id}>
              <img src={food.image} alt={food.name} />
              <div className="kitchen-menu-card-content">
                <div className="kitchen-menu-title"><div><p>{food.category}</p><h2>{food.name}</h2></div><span className={`kitchen-availability ${food.available ? 'is-available' : 'is-unavailable'}`}>{food.available ? 'Available' : 'Unavailable'}</span></div>
                <p className="kitchen-menu-description">{food.description}</p>
                <strong className="kitchen-menu-price">{formatNaira(food.price)}</strong>
                <footer className="kitchen-menu-actions">
                  <Link to={`/kitchen/menu/${food.id}/edit`} className="kitchen-secondary-link">Edit</Link>
                  <button type="button" className="kitchen-toggle-button" aria-pressed={!food.available} onClick={() => dispatch(toggleFoodAvailability(food.id))}>{food.available ? 'Disable' : 'Enable'}</button>
                </footer>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="kitchen-empty-state"><h2>Your menu is empty</h2><p>Add your first food item to begin.</p><Link to="/kitchen/menu/new" className="kitchen-primary-link">Add your first food</Link></section>
      )}
    </div>
  )
}

export default KitchenMenu