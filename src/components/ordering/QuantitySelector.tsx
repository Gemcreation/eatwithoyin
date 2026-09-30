import { MinusSignIcon, PlusSignIcon } from 'hugeicons-react'

interface QuantitySelectorProps {
  quantity: number
  onChange: (quantity: number) => void
  label?: string
}

const QuantitySelector = ({ quantity, onChange, label = 'Quantity' }: QuantitySelectorProps) => (
  <div className="quantity-control" aria-label={label}>
    <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => onChange(quantity - 1)}>
      <MinusSignIcon size={16} />
    </button>
    <span aria-live="polite">{quantity}</span>
    <button type="button" aria-label="Increase quantity" onClick={() => onChange(quantity + 1)}>
      <PlusSignIcon size={16} />
    </button>
  </div>
)

export default QuantitySelector