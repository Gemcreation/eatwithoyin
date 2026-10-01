import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../app/store'
import { addFood, updateFood } from '../../../features/ordering/orderingSlice'
import type { Food } from '../../../features/ordering/types'
import KitchenMenuForm from '../../kitchen/KitchenMenuForm'

const KitchenMenuFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const foods = useSelector((state: RootState) => state.ordering.foods)
  const existingFood = id ? foods.find((food) => food.id === id) : undefined
  const isEditing = Boolean(id)

  if (isEditing && !existingFood) {
    return <section className="kitchen-empty-state"><h1>Food item not found</h1><p>This item is not in the saved frontend menu.</p><Link to="/kitchen/menu" className="kitchen-secondary-link">Back to menu</Link></section>
  }

  const handleSave = (food: Food) => {
    if (isEditing) dispatch(updateFood(food))
    else dispatch(addFood(food))
    navigate('/kitchen/menu')
  }

  return (
    <div className="kitchen-page kitchen-form-page">
      <header className="kitchen-page-heading"><div><p className="kitchen-eyebrow">Kitchen catalogue</p><h1>{isEditing ? 'Edit food' : 'Add food'}</h1><p>{isEditing ? 'Update the item shown in your menu.' : 'Add an item to the customer-facing menu.'}</p></div></header>
      <KitchenMenuForm key={existingFood?.id ?? 'new-food'} initialFood={existingFood} onSave={handleSave} />
    </div>
  )
}

export default KitchenMenuFormPage