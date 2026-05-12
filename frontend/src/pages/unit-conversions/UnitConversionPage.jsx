import { useEffect, useState } from 'react'
import UnitConversionCalculator from '../../components/unit-conversions/UnitConversionCalculator'
import UnitConversionForm from '../../components/unit-conversions/UnitConversionForm'
import UnitConversionTable from '../../components/unit-conversions/UnitConversionTable'
import {
  calculateUnitConversion,
  createUnitConversion,
  deleteUnitConversion,
  getUnitConversions,
  updateUnitConversion,
} from '../../services/unitConversionService'

function UnitConversionPage({ t }) {
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [calculation, setCalculation] = useState(null)
  const [message, setMessage] = useState('')

  const loadItems = async () => {
    try {
      const response = await getUnitConversions()
      setItems(response.data)
    } catch {
      setMessage(t.messages.loadFailed)
    }
  }

  useEffect(() => {
    let isMounted = true

    getUnitConversions()
      .then((response) => {
        if (isMounted) {
          setItems(response.data)
        }
      })
      .catch(() => {
        if (isMounted) {
          setMessage(t.messages.loadFailed)
        }
      })

    return () => {
      isMounted = false
    }
  }, [t.messages.loadFailed])

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateUnitConversion(editingItem.MADVT, formData)
        setMessage(t.messages.updated)
      } else {
        await createUnitConversion(formData)
        setMessage(t.messages.created)
      }

      setEditingItem(null)
      await loadItems()
    } catch (error) {
      setMessage(error.response?.data?.message || t.messages.saveFailed)
    }
  }

  const handleDelete = async (MADVT) => {
    if (!window.confirm(t.deleteConfirm)) {
      return
    }

    try {
      await deleteUnitConversion(MADVT)
      setCalculation(null)
      setMessage(t.messages.deleted)
      await loadItems()
    } catch {
      setMessage(t.messages.deleteFailed)
    }
  }

  const handleCalculate = async (MADVT) => {
    try {
      const response = await calculateUnitConversion(MADVT)
      setCalculation(response.data)
      setMessage('')
    } catch {
      setMessage(t.messages.calculateFailed)
    }
  }

  return (
    <section className="unit-page">
      <div className="unit-page-header">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>
      </div>

      {message ? <p className="unit-message">{message}</p> : null}

      <div className="unit-layout">
        <div className="unit-panel">
          <h3>{editingItem ? t.editTitle : t.addTitle}</h3>
          <UnitConversionForm
            key={editingItem?.MADVT || 'new'}
            editingItem={editingItem}
            t={t}
            onCancel={() => setEditingItem(null)}
            onSubmit={handleSubmit}
          />
        </div>

        <UnitConversionCalculator result={calculation} t={t} />
      </div>

      <div className="unit-panel">
        <h3>{t.listTitle}</h3>
        <UnitConversionTable
          items={items}
          t={t}
          onCalculate={handleCalculate}
          onDelete={handleDelete}
          onEdit={setEditingItem}
        />
      </div>
    </section>
  )
}

export default UnitConversionPage
