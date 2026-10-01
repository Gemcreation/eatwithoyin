import { useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../app/store'
import { updateKitchenSettings } from '../../../features/ordering/orderingSlice'
import type { KitchenSettings } from '../../../features/ordering/types'

const KitchenSettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector((state: RootState) => state.ordering.kitchenSettings)
  const [fields, setFields] = useState<KitchenSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [feeError, setFeeError] = useState('')

  const updateField = <K extends keyof KitchenSettings>(key: K, value: KitchenSettings[K]) => {
    setFields((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!Number.isFinite(fields.deliveryFee) || fields.deliveryFee < 0) {
      setFeeError('Enter a delivery fee of zero or more.')
      return
    }
    setFeeError('')
    dispatch(updateKitchenSettings(fields))
    setSaved(true)
  }

  return (
    <div className="kitchen-page">
      <header className="kitchen-page-heading"><div><p className="kitchen-eyebrow">Workspace setup</p><h1>Settings</h1><p>Frontend-only kitchen details and operating preferences.</p></div></header>
      <form className="kitchen-settings-form" onSubmit={submit}>
        <section className="kitchen-panel">
          <header className="kitchen-panel-heading"><div><h2>Kitchen information</h2><p>Shown as local settings in this prototype.</p></div></header>
          <div className="kitchen-form-fields">
            <label className="kitchen-field">Kitchen name<input value={fields.name} onChange={(event) => updateField('name', event.target.value)} /></label>
            <label className="kitchen-field">Phone<input type="tel" value={fields.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
            <label className="kitchen-field kitchen-field-wide">Address<input value={fields.address} onChange={(event) => updateField('address', event.target.value)} /></label>
          </div>
        </section>
        <section className="kitchen-panel">
          <header className="kitchen-panel-heading"><div><h2>Operating hours</h2><p>These controls do not automatically pause customer ordering.</p></div></header>
          <div className="kitchen-form-fields">
            <label className="kitchen-field">Opens at<input type="time" value={fields.openingTime} onChange={(event) => updateField('openingTime', event.target.value)} /></label>
            <label className="kitchen-field">Closes at<input type="time" value={fields.closingTime} onChange={(event) => updateField('closingTime', event.target.value)} /></label>
            <label className="kitchen-switch-field"><input type="checkbox" checked={fields.isOpen} onChange={(event) => updateField('isOpen', event.target.checked)} /><span><strong>Kitchen is open</strong><small>Mock operating state only.</small></span></label>
          </div>
        </section>
        <section className="kitchen-panel">
          <header className="kitchen-panel-heading"><div><h2>Delivery</h2><p>The delivery fee updates customer cart and checkout totals.</p></div></header>
          <div className="kitchen-form-fields">
            <label className="kitchen-field">Delivery fee (₦)<input type="number" min="0" step="50" value={fields.deliveryFee} aria-invalid={Boolean(feeError)} onChange={(event) => { updateField('deliveryFee', Number(event.target.value)); setFeeError('') }} />{feeError && <span className="kitchen-field-error">{feeError}</span>}</label>
            <label className="kitchen-switch-field"><input type="checkbox" checked={fields.deliveryAvailable} onChange={(event) => updateField('deliveryAvailable', event.target.checked)} /><span><strong>Delivery available</strong><small>Mock setting; does not yet restrict order placement.</small></span></label>
          </div>
        </section>
        <footer className="kitchen-settings-actions"><span role="status">{saved ? 'Settings saved on this device.' : ''}</span><button type="submit" className="kitchen-primary-link">Save settings</button></footer>
      </form>
    </div>
  )
}

export default KitchenSettingsPage