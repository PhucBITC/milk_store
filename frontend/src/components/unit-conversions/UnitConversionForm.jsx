import { useState } from 'react'

const emptyForm = {
  MADVT: '',
  DVT1: '',
  DVT2: '',
  DVT3: '',
  QC1: 1,
  QC2: 1,
}

function UnitConversionForm({ editingItem, t, onCancel, onSubmit }) {
  const initialFormData = editingItem
    ? {
        MADVT: editingItem.MADVT,
        DVT1: editingItem.DVT1,
        DVT2: editingItem.DVT2,
        DVT3: editingItem.DVT3,
        QC1: editingItem.QC1,
        QC2: editingItem.QC2,
      }
    : emptyForm
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === 'QC1' || name === 'QC2' ? Number(value) : value.toUpperCase(),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="unit-form" onSubmit={handleSubmit}>
      <label>
        {t.fields.MADVT}
        <input
          name="MADVT"
          value={formData.MADVT}
          onChange={handleChange}
          placeholder={t.placeholders.MADVT}
          readOnly={Boolean(editingItem)}
          required
        />
      </label>

      <label>
        {t.fields.DVT1}
        <input
          name="DVT1"
          value={formData.DVT1}
          onChange={handleChange}
          placeholder={t.placeholders.DVT1}
          required
        />
      </label>

      <label>
        {t.fields.DVT2}
        <input
          name="DVT2"
          value={formData.DVT2}
          onChange={handleChange}
          placeholder={t.placeholders.DVT2}
          required
        />
      </label>

      <label>
        {t.fields.DVT3}
        <input
          name="DVT3"
          value={formData.DVT3}
          onChange={handleChange}
          placeholder={t.placeholders.DVT3}
          required
        />
      </label>

      <label>
        {t.fields.QC1}
        <input
          min="1"
          name="QC1"
          type="number"
          value={formData.QC1}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        {t.fields.QC2}
        <input
          min="1"
          name="QC2"
          type="number"
          value={formData.QC2}
          onChange={handleChange}
          required
        />
      </label>

      <div className="unit-form-actions">
        <button type="submit" className="pay-action">
          {editingItem ? t.submitUpdate : t.submitCreate}
        </button>
        {editingItem ? (
          <button type="button" className="secondary-admin-action" onClick={onCancel}>
            {t.cancel}
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default UnitConversionForm
