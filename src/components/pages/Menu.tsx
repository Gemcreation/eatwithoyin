import { useState } from 'react'
import { Search01Icon } from 'hugeicons-react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store'
import FoodCard from '../ordering/FoodCard'
import { foods, foodCategories } from '../../features/ordering/data'
import { addToCart } from '../../features/ordering/orderingSlice'
import type { Food, FoodCategory } from '../../features/ordering/types'

const Menu = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [category, setCategory] = useState<'All' | FoodCategory>('All')
  const [search, setSearch] = useState('')
  const filteredFoods = foods.filter((food) => {
    const matchesCategory = category === 'All' || food.category === category
    const matchesSearch = `${food.name} ${food.description} ${food.category}`.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAdd = (food: Food) => {
    dispatch(addToCart({ foodId: food.id, name: food.name, image: food.image, price: food.price, quantity: 1 }))
  }

  return (
    <main className="ordering-page">
      <header className="ordering-page-header">
        <div>
          <p className="eyebrow">Made fresh at Oyin's kitchen</p>
          <h1>Good food, ready when you are.</h1>
          <p>Find a familiar favourite, made fresh and delivered to your door.</p>
        </div>
        <label className="menu-search">
          <Search01Icon size={19} />
          <span className="sr-only">Search menu</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search meals" />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">Clear</button>}
        </label>
      </header>

      <nav className="category-filters" aria-label="Food categories">
        {foodCategories.map((item) => (
          <button key={item} type="button" className={category === item ? 'is-selected' : ''} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </nav>

      {filteredFoods.length > 0 ? (
        <section className="food-grid" aria-label="Menu items">
          {filteredFoods.map((food) => <FoodCard key={food.id} food={food} onAdd={handleAdd} />)}
        </section>
      ) : (
        <section className="empty-state menu-empty-state">
          <h2>No meals found</h2>
          <p>{search ? 'Try a different search or browse another category.' : 'There are no items in this category right now.'}</p>
          <button type="button" className="button-outline" onClick={() => { setCategory('All'); setSearch('') }}>Show all menu items</button>
        </section>
      )}
    </main>
  )
}

export default Menu