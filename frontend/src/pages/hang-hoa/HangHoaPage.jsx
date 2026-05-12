import { useEffect, useState } from 'react'
import {
  createHangHoa,
  deleteHangHoa,
  getHangHoaList,
  searchHangHoa,
  updateHangHoa,
} from '../../services/hangHoaService'
import { getNhomHangList } from '../../services/nhomHangService'

const emptyForm = {
  maHang: '',
  tenHang: '',
  maNhomHang: '',
  dvt: '',
  giaBan: '',
  giaNhap: '',
  tonKho: '',
  ghiChu: '',
}

function HangHoaPage({ t }) {
  const [items, setItems] = useState([])
  const [nhomHangItems, setNhomHangItems] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingItem, setEditingItem] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')

  const loadItems = async () => {
    try {
      const response = await getHangHoaList()
      setItems(response.data)
    } catch {
      setMessage(t.messages.loadFailed)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchInitialData = async () => {
      try {
        const nhomHangRes = await getNhomHangList()
        if (isMounted) {
          setNhomHangItems(nhomHangRes.data)
        }
      } catch {
        // Bỏ qua nếu lỗi
      }

      try {
        const hangHoaRes = await getHangHoaList()
        if (isMounted) {
          setItems(hangHoaRes.data)
        }
      } catch {
        if (isMounted) {
          setMessage(t.messages.loadFailed)
        }
      }
    }

    fetchInitialData()

    return () => {
      isMounted = false
    }
  }, [t.messages.loadFailed])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === 'tenHang' || name === 'maHang' ? value.toUpperCase() : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      giaBan: formData.giaBan ? Number(formData.giaBan) : 0,
      giaNhap: formData.giaNhap ? Number(formData.giaNhap) : 0,
      tonKho: formData.tonKho ? Number(formData.tonKho) : 0,
    }

    try {
      if (editingItem) {
        await updateHangHoa(editingItem.maHang, payload)
        setMessage(t.messages.updated)
      } else {
        await createHangHoa(payload)
        setMessage(t.messages.created)
      }

      setFormData(emptyForm)
      setEditingItem(null)
      await loadItems()
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data || t.messages.saveFailed)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      maHang: item.maHang || '',
      tenHang: item.tenHang || '',
      maNhomHang: item.maNhomHang || '',
      dvt: item.dvt || '',
      giaBan: item.giaBan || '',
      giaNhap: item.giaNhap || '',
      tonKho: item.tonKho || '',
      ghiChu: item.ghiChu || '',
    })
    setMessage('')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setFormData(emptyForm)
  }

  const handleDelete = async (maHang) => {
    if (!window.confirm(t.deleteConfirm)) {
      return
    }

    try {
      await deleteHangHoa(maHang)
      setMessage(t.messages.deleted)
      await loadItems()
    } catch {
      setMessage(t.messages.deleteFailed)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()

    try {
      const response = keyword.trim()
        ? await searchHangHoa(keyword.trim())
        : await getHangHoaList()
      setItems(response.data)
      setMessage('')
    } catch {
      setMessage(t.messages.searchFailed)
    }
  }

  // Nhóm các nhóm hàng theo nhóm chủ để hiển thị cực kỳ trực quan
  const groupsByNhomChu = nhomHangItems.reduce((acc, current) => {
    const key = current.tenNhomChu || 'Khác'
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(current)
    return acc
  }, {})

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
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label>
              {t.fields.maHang}
              <input
                name="maHang"
                value={formData.maHang}
                onChange={handleChange}
                placeholder={t.placeholders.maHang}
                disabled={!!editingItem} // Không cho sửa mã khi edit
              />
            </label>

            <label>
              {t.fields.tenHang}
              <input
                name="tenHang"
                value={formData.tenHang}
                onChange={handleChange}
                placeholder={t.placeholders.tenHang}
                required
              />
            </label>

            <label>
              {t.fields.nhomHang}
              <select
                name="maNhomHang"
                value={formData.maNhomHang}
                onChange={handleChange}
                required
              >
                <option value="">{t.selectNhomHang}</option>
                {Object.entries(groupsByNhomChu).map(([nhomChuName, list]) => (
                  <optgroup key={nhomChuName} label={`Nhóm chủ: ${nhomChuName}`}>
                    {list.map((item) => (
                      <option key={item.maNhomHang} value={item.maNhomHang}>
                        {item.tenNhomHang}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <label>
              {t.fields.dvt}
              <input
                name="dvt"
                value={formData.dvt}
                onChange={handleChange}
                placeholder={t.placeholders.dvt}
                required
              />
            </label>

            <label>
              {t.fields.giaBan}
              <input
                type="number"
                name="giaBan"
                value={formData.giaBan}
                onChange={handleChange}
                placeholder={t.placeholders.giaBan}
                min="0"
              />
            </label>

            <label>
              {t.fields.giaNhap}
              <input
                type="number"
                name="giaNhap"
                value={formData.giaNhap}
                onChange={handleChange}
                placeholder={t.placeholders.giaNhap}
                min="0"
              />
            </label>

            <label>
              {t.fields.tonKho}
              <input
                type="number"
                name="tonKho"
                value={formData.tonKho}
                onChange={handleChange}
                placeholder={t.placeholders.tonKho}
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
          </div>

          <div className="unit-form-actions" style={{ marginTop: '1.5rem' }}>
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
                <th>{t.fields.maHang}</th>
                <th>{t.fields.tenHang}</th>
                <th>{t.fields.nhomHang}</th>
                <th>{t.fields.dvt}</th>
                <th>{t.fields.giaBan}</th>
                <th>{t.fields.tonKho}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7">{t.empty}</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.maHang}>
                    <td><strong>{item.maHang}</strong></td>
                    <td>{item.tenHang}</td>
                    <td>
                      <div>{item.tenNhomHang}</div>
                      <small style={{ opacity: 0.7 }}>{item.tenNhomChu}</small>
                    </td>
                    <td>{item.dvt}</td>
                    <td>{Number(item.giaBan).toLocaleString('vi-VN')}</td>
                    <td>{item.tonKho}</td>
                    <td>
                      <div className="unit-row-actions">
                        <button type="button" onClick={() => handleEdit(item)}>
                          {t.edit}
                        </button>
                        <button type="button" onClick={() => handleDelete(item.maHang)}>
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

export default HangHoaPage
