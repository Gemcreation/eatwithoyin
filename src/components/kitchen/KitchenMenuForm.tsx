import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Food, FoodCategory } from '../../features/ordering/types'

interface KitchenMenuFormProps {
  initialFood?: Food
  onSave: (food: Food) => void
}

interface MenuFields {
  name: string
  description: string
  price: string
  category: FoodCategory
  image: string
  available: boolean
}

type MenuErrors = Partial<Record<'name' | 'description' | 'price' | 'image', string>>

const categories: FoodCategory[] = ['Rice', 'Chicken', 'Local Dishes', 'Drinks', 'Snacks']

const KitchenMenuForm = ({ initialFood, onSave }: KitchenMenuFormProps) => {
  const [fields, setFields] = useState<MenuFields>(() => initialFood
    ? { ...initialFood, price: String(initialFood.price) }
    : { name: '', description: '', price: '', category: 'Rice', image: '', available: true })
  const [errors, setErrors] = useState<MenuErrors>({})
  const isEditing = Boolean(initialFood)

  const updateField = <K extends keyof MenuFields>(key: K, value: MenuFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: MenuErrors = {}
    const price = Number(fields.price)
    if (!fields.name.trim()) nextErrors.name = 'Enter a food name.'
    if (!fields.description.trim()) nextErrors.description = 'Add a short description.'
    if (!fields.price.trim() || !Number.isFinite(price) || price <= 0) nextErrors.price = 'Enter a price greater than zero.'
    if (!fields.image.trim()) nextErrors.image = 'Add an image URL.'
    else {
      try { new URL(fields.image) } catch { nextErrors.image = 'Enter a complete image URL.' }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      id: initialFood?.id ?? `food-${Date.now()}`,
      name: fields.name.trim(),
      description: fields.description.trim(),
      price,
      category: fields.category,
      image: fields.image.trim(),
      available: fields.available,
    })
  }

  const error = (key: keyof MenuErrors) => errors[key] && <span className="kitchen-field-error">{errors[key]}</span>

  return (
    <form className="kitchen-form" onSubmit={submit} noValidate>
      <div className="kitchen-form-fields">
        <label className="kitchen-field">
          Food name
          <input value={fields.name} aria-invalid={Boolean(errors.name)} onChange={(event) => updateField('name', event.target.value)} />
          {error('name')}
        </label>
        <label className="kitchen-field">
          Category
          <select value={fields.category} onChange={(event) => updateField('category', event.target.value as FoodCategory)}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="kitchen-field">
          Price (₦)
          <input type="number" min="1" step="50" value={fields.price} aria-invalid={Boolean(errors.price)} onChange={(event) => updateField('price', event.target.value)} />
          {error('price')}
        </label>
        <label className="kitchen-field kitchen-field-wide">
          Description
          <textarea rows={4} value={fields.description} aria-invalid={Boolean(errors.description)} onChange={(event) => updateField('description', event.target.value)} />
          {error('description')}
        </label>
        <label className="kitchen-field kitchen-field-wide">
          Image URL
          <input type="url" value={fields.image} placeholder="https://example.com/food.jpg" aria-invalid={Boolean(errors.image)} onChange={(event) => updateField('image', event.target.value)} />
          {error('image')}
        </label>
        {fields.image && <img className="kitchen-image-preview" src={fields.image} alt="Food preview" onError={(event) => { event.currentTarget.hidden = true }} onLoad={(event) => { event.currentTarget.hidden = false }} />}
        <label className="kitchen-switch-field">
          <input type="checkbox" checked={fields.available} onChange={(event) => updateField('available', event.target.checked)} />
          <span><strong>Available to order</strong><small>Customers can add this item to their cart while it is available.</small></span>
        </label>
      </div>
      <footer className="kitchen-form-actions">
        <Link to="/kitchen/menu" className="kitchen-secondary-link">Cancel</Link>
        <button type="submit" className="kitchen-primary-link">{isEditing ? 'Save changes' : 'Add food'}</button>
      </footer>
    </form>
  )
}

export default KitchenMenuForm