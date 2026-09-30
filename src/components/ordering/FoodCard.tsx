import { Link } from 'react-router-dom'
import { Add01Icon, Tick01Icon } from 'hugeicons-react'
import type { Food } from '../../features/ordering/types'
import { formatNaira } from '../../features/ordering/utils'

interface FoodCardProps {
  food: Food
  onAdd: (food: Food) => void
}

const FoodCard = ({ food, onAdd }: FoodCardProps) => (
  <article className="menu-food-card">
    <Link to={`/menu/${food.id}`} className="menu-food-image-link" aria-label={`View ${food.name}`}>
      <img src={food.image} alt={food.name} className="menu-food-image" />
      <span className={`availability-pill ${food.available ? 'is-available' : 'is-unavailable'}`}>
        {food.available ? 'Available' : 'Sold out'}
      </span>
    </Link>
    <div className="menu-food-content">
      <div className="menu-food-heading">
        <div>
          <p className="menu-food-category">{food.category}</p>
          <Link to={`/menu/${food.id}`} className="menu-food-name">{food.name}</Link>
        </div>
        <strong>{formatNaira(food.price)}</strong>
      </div>
      <p className="menu-food-description">{food.description}</p>
      <div className="menu-food-actions">
        <Link to={`/menu/${food.id}`} className="text-link">View details</Link>
        <button type="button" className="button-primary compact-button" disabled={!food.available} onClick={() => onAdd(food)}>
          {food.available ? <><Add01Icon size={17} /> Add</> : <><Tick01Icon size={17} /> Unavailable</>}
        </button>
      </div>
    </div>
  </article>
)

export default FoodCard