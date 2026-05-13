import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  createNhomChu,
  deleteNhomChu,
  getNhomChuList,
  searchNhomChu,
  updateNhomChu,
} from '../../services/nhomChuService'

const emptyForm = {
  tenNhom: '',
  ghiChu: '',
}

function NhomChuPage({ t }) {
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingItem, setEditingItem] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')

  const loadItems = async () => {
    try {
      const response = await getNhomChuList()
      setItems(response.data)
    } catch {
      toast.error(t.messages.loadFailed)
    }
  }

  useEffect(() => {
    let isMounted = true

    getNhomChuList()
      .then((response) => {
        if (isMounted) {
          setItems(response.data)
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error(t.messages.loadFailed)
        }
      })

    return () => {
      isMounted = false
    }
  }, [t.messages.loadFailed])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === 'tenNhom' ? value.toUpperCase() : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingItem) {
        await updateNhomChu(editingItem.maNhom, formData)
        setMessage('')
        toast.success(t.messages.updated)
      } else {
        await createNhomChu(formData)
        setMessage('')
        toast.success(t.messages.created)
      }

      setFormData(emptyForm)
      setEditingItem(null)
      await loadItems()
    } catch (error) {
      const errMsg = error.response?.data?.message || t.messages.saveFailed
      setMessage(errMsg)
      toast.error(errMsg)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      tenNhom: item.tenNhom || '',
      ghiChu: item.ghiChu || '',
    })
    setMessage('')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setFormData(emptyForm)
    setMessage('')
  }

  const handleDelete = async (maNhom) => {
    if (!window.confirm(t.deleteConfirm)) {
      return
    }

    try {
      await deleteNhomChu(maNhom)
      setMessage('')
      toast.success(t.messages.deleted)
      await loadItems()
    } catch {
      setMessage(t.messages.deleteFailed)
      toast.error(t.messages.deleteFailed)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()

    try {
      const response = keyword.trim()
        ? await searchNhomChu(keyword.trim())
        : await getNhomChuList()
      setItems(response.data)
      setMessage('')
      if (keyword.trim()) {
        toast.info(`Kết quả tìm kiếm cho "${keyword.trim()}"`)
      }
    } catch {
      setMessage(t.messages.searchFailed)
      toast.error(t.messages.searchFailed)
    }
  }

  return (
    <section className="unit-page">
      <div className="unit-page-header">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>

      {message ? <p className="unit-message">{message}</p> : null}

      <div className="unit-panel">
        <h3>{editingItem ? t.editTitle : t.addTitle}</h3>
        <form className="nhom-chu-form" onSubmit={handleSubmit}>
          <label>
            {t.fields.tenNhom}
            <input
              name="tenNhom"
              value={formData.tenNhom}
              onChange={handleChange}
              placeholder={t.placeholders.tenNhom}
              required
            />
          </label>

          <label>
            {t.fields.ghiChu}
            <input
              name="ghiChu"
              value={formData.ghiChu}
              onChange={handleChange}
              placeholder={t.placeholders.ghiChu}
            />
          </label>

          <div className="unit-form-actions">
            <button type="submit" className="pay-action">
              {editingItem ? t.submitUpdate : t.submitCreate}
            </button>
            {editingItem ? (
              <button type="button" className="secondary-admin-action" onClick={handleCancel}>
                {t.cancel}
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="unit-panel">
        <div className="nhom-chu-toolbar">
          <h3>{t.listTitle}</h3>
          <form onSubmit={handleSearch}>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t.searchPlaceholder}
            />
            <button type="submit" className="secondary-admin-action">
              {t.search}
            </button>
          </form>
        </div>

        <div className="unit-table-wrap">
          <table className="unit-table">
            <thead>
              <tr>
                <th>{t.fields.maNhom}</th>
                <th>{t.fields.tenNhom}</th>
                <th>{t.fields.ghiChu}</th>
                <th>{t.fields.ngayTao}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5">{t.empty}</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.maNhom}>
                    <td>{item.maNhom}</td>
                    <td>{item.tenNhom}</td>
                    <td>{item.ghiChu || ''}</td>
                    <td>{formatDateTime(item.ngayTao)}</td>
                    <td>
                      <div className="unit-row-actions">
                        <button type="button" onClick={() => handleEdit(item)}>
                          {t.edit}
                        </button>
                        <button type="button" onClick={() => handleDelete(item.maNhom)}>
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function formatDateTime(value) {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleString('vi-VN')
}

export default NhomChuPage
