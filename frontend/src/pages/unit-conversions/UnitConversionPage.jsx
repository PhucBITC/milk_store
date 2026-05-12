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

function UnitConversionPage() {
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [calculation, setCalculation] = useState(null)
  const [message, setMessage] = useState('')

  const loadItems = async () => {
    try {
      const response = await getUnitConversions()
      setItems(response.data)
    } catch {
      setMessage('Không thể tải danh sách đơn vị tính.')
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
          setMessage('Không thể tải danh sách đơn vị tính.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateUnitConversion(editingItem.MADVT, formData)
        setMessage('Đã cập nhật đơn vị tính.')
      } else {
        await createUnitConversion(formData)
        setMessage('Đã thêm đơn vị tính.')
      }

      setEditingItem(null)
      await loadItems()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể lưu đơn vị tính.')
    }
  }

  const handleDelete = async (MADVT) => {
    if (!window.confirm('Xóa đơn vị tính này?')) {
      return
    }

    try {
      await deleteUnitConversion(MADVT)
      setCalculation(null)
      setMessage('Đã xóa đơn vị tính.')
      await loadItems()
    } catch {
      setMessage('Không thể xóa đơn vị tính.')
    }
  }

  const handleCalculate = async (MADVT) => {
    try {
      const response = await calculateUnitConversion(MADVT)
      setCalculation(response.data)
      setMessage('')
    } catch {
      setMessage('Không thể tính quy đổi.')
    }
  }

  return (
    <section className="unit-page">
      <div className="unit-page-header">
        <div>
          <p className="eyebrow">Đơn vị tính</p>
          <h2>Unit Conversion</h2>
          <p>Quản lý quy đổi DVT1 → DVT2 → DVT3 cho sản phẩm.</p>
        </div>
      </div>

      {message ? <p className="unit-message">{message}</p> : null}

      <div className="unit-layout">
        <div className="unit-panel">
          <h3>{editingItem ? 'Sửa đơn vị tính' : 'Thêm đơn vị tính'}</h3>
          <UnitConversionForm
            key={editingItem?.MADVT || 'new'}
            editingItem={editingItem}
            onCancel={() => setEditingItem(null)}
            onSubmit={handleSubmit}
          />
        </div>

        <UnitConversionCalculator result={calculation} />
      </div>

      <div className="unit-panel">
        <h3>Danh sách đơn vị tính</h3>
        <UnitConversionTable
          items={items}
          onCalculate={handleCalculate}
          onDelete={handleDelete}
          onEdit={setEditingItem}
        />
      </div>
    </section>
  )
}

export default UnitConversionPage
