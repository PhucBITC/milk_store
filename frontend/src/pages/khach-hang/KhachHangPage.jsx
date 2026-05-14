import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  createKhachHang,
  deleteKhachHang,
  getKhachHangList,
  searchKhachHang,
  updateKhachHang,
} from '../../services/khachHangService'

const emptyForm = {
  maKhachHang: '',
  tenKhachHang: '',
  soDt: '',
  maSoThue: '',
  diaChi: '',
  maQuanHeNganSach: '',
  cccd: '',
}

const fallbackLabels = {
  menuTitle: 'Khách hàng',
  pageTitle: 'Quản lý khách hàng',
  eyebrow: 'Khách hàng',
  title: 'Quản lý khách hàng',
  description: 'Lưu thông tin khách lẻ, đại lý, công ty và dữ liệu xuất hóa đơn.',
  addTitle: 'Thêm khách hàng',
  editTitle: 'Sửa khách hàng',
  listTitle: 'Danh sách khách hàng',
  searchPlaceholder: 'Tìm theo mã, tên, SĐT hoặc mã số thuế',
  search: 'Tìm kiếm',
  submitCreate: 'Thêm mới',
  submitUpdate: 'Lưu thay đổi',
  cancel: 'Hủy',
  actions: 'Hành động',
  edit: 'Sửa',
  delete: 'Xóa',
  empty: 'Chưa có khách hàng.',
  deleteConfirm: 'Xóa khách hàng này?',
  searchResult: 'Kết quả tìm kiếm cho',
  fields: {
    maKhachHang: 'Mã khách hàng',
    tenKhachHang: 'Tên khách hàng',
    soDt: 'SĐT',
    maSoThue: 'Mã số thuế',
    diaChi: 'Địa chỉ',
    maQuanHeNganSach: 'Mã QHNS',
    cccd: 'CCCD',
    ngayTao: 'Ngày tạo',
  },
  placeholders: {
    maKhachHang: 'VD: KH001',
    tenKhachHang: 'VD: CÔNG TY TNHH ABC',
    soDt: 'VD: 0901234567',
    maSoThue: 'VD: 0312345678',
    diaChi: 'VD: 12 Nguyễn Trãi, TP.HCM',
    maQuanHeNganSach: 'VD: 1234567',
    cccd: 'VD: 079xxxxxxxxx',
  },
  messages: {
    loadFailed: 'Không thể tải danh sách khách hàng.',
    created: 'Đã thêm khách hàng.',
    updated: 'Đã cập nhật khách hàng.',
    saveFailed: 'Không thể lưu khách hàng.',
    deleted: 'Đã xóa khách hàng.',
    deleteFailed: 'Không thể xóa khách hàng.',
    searchFailed: 'Không thể tìm kiếm khách hàng.',
  },
}

function KhachHangPage({ t = fallbackLabels }) {
  const labels = { ...fallbackLabels, ...t }
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingItem, setEditingItem] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')

  const loadItems = async () => {
    try {
      const response = await getKhachHangList()
      setItems(response.data)
    } catch {
      toast.error(labels.messages.loadFailed)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextValue = ['maKhachHang', 'tenKhachHang'].includes(name) ? value.toUpperCase() : value

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
      ...(name === 'maKhachHang' ? { soDt: nextValue } : {}),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingItem) {
        await updateKhachHang(editingItem.maKhachHang, formData)
        toast.success(labels.messages.updated)
      } else {
        await createKhachHang(formData)
        toast.success(labels.messages.created)
      }

      setMessage('')
      setFormData(emptyForm)
      setEditingItem(null)
      await loadItems()
    } catch (error) {
      const errMsg = getErrorMessage(error, labels.messages.saveFailed)
      setMessage(errMsg)
      toast.error(errMsg)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      maKhachHang: item.maKhachHang || '',
      tenKhachHang: item.tenKhachHang || '',
      soDt: item.soDt || '',
      maSoThue: item.maSoThue || '',
      diaChi: item.diaChi || '',
      maQuanHeNganSach: item.maQuanHeNganSach || '',
      cccd: item.cccd || '',
    })
    setMessage('')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setFormData(emptyForm)
    setMessage('')
  }

  const handleDelete = async (maKhachHang) => {
    if (!window.confirm(labels.deleteConfirm)) {
      return
    }

    try {
      await deleteKhachHang(maKhachHang)
      setMessage('')
      toast.success(labels.messages.deleted)
      await loadItems()
    } catch {
      setMessage(labels.messages.deleteFailed)
      toast.error(labels.messages.deleteFailed)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()

    try {
      const response = keyword.trim()
        ? await searchKhachHang(keyword.trim())
        : await getKhachHangList()
      setItems(response.data)
      setMessage('')
      if (keyword.trim()) {
        toast.info(`${labels.searchResult} "${keyword.trim()}"`)
      }
    } catch {
      setMessage(labels.messages.searchFailed)
      toast.error(labels.messages.searchFailed)
    }
  }

  return (
    <section className="unit-page">
      <div className="unit-page-header">
        <p className="eyebrow">{labels.eyebrow}</p>
        <h2>{labels.title}</h2>
        <p>{labels.description}</p>
      </div>

      {message ? <p className="unit-message">{message}</p> : null}

      <div className="unit-panel">
        <h3>{editingItem ? labels.editTitle : labels.addTitle}</h3>
        <form className="nhom-chu-form" onSubmit={handleSubmit}>
          <label className="nhom-chu-form-wide">
            {labels.fields.tenKhachHang}
            <input name="tenKhachHang" value={formData.tenKhachHang} onChange={handleChange} placeholder={labels.placeholders.tenKhachHang} required />
          </label>

          <label>
            {labels.fields.maKhachHang}
            <input name="maKhachHang" value={formData.maKhachHang} onChange={handleChange} placeholder={labels.placeholders.maKhachHang} inputMode="numeric" pattern="\d{8,15}" title="Mã khách hàng là SĐT, gồm 8 đến 15 chữ số." required readOnly={Boolean(editingItem)} />
          </label>

          <label>
            {labels.fields.soDt}
            <input name="soDt" value={formData.soDt} placeholder={labels.placeholders.soDt} readOnly />
          </label>

          <label>
            {labels.fields.maSoThue}
            <input name="maSoThue" value={formData.maSoThue} onChange={handleChange} placeholder={labels.placeholders.maSoThue} inputMode="numeric" pattern="(?:\d{10}|\d{13})" title="Mã số thuế phải gồm 10 hoặc 13 chữ số." />
          </label>

          <label>
            {labels.fields.diaChi}
            <input name="diaChi" value={formData.diaChi} onChange={handleChange} placeholder={labels.placeholders.diaChi} />
          </label>

          <label>
            {labels.fields.maQuanHeNganSach}
            <input name="maQuanHeNganSach" value={formData.maQuanHeNganSach} onChange={handleChange} placeholder={labels.placeholders.maQuanHeNganSach} inputMode="numeric" pattern="\d{1,20}" title="Mã QHNS chỉ gồm chữ số, tối đa 20 ký tự." />
          </label>

          <label>
            {labels.fields.cccd}
            <input name="cccd" value={formData.cccd} onChange={handleChange} placeholder={labels.placeholders.cccd} inputMode="numeric" pattern="(?:\d{9}|\d{12})" title="CCCD/CMND phải gồm 9 hoặc 12 chữ số." />
          </label>

          <div className="unit-form-actions">
            <button type="submit" className="pay-action">
              {editingItem ? labels.submitUpdate : labels.submitCreate}
            </button>
            {editingItem ? (
              <button type="button" className="secondary-admin-action" onClick={handleCancel}>
                {labels.cancel}
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="unit-panel">
        <div className="nhom-chu-toolbar">
          <h3>{labels.listTitle}</h3>
          <form onSubmit={handleSearch}>
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={labels.searchPlaceholder} />
            <button type="submit" className="secondary-admin-action">
              {labels.search}
            </button>
          </form>
        </div>

        <div className="unit-table-wrap">
          <table className="unit-table">
            <thead>
              <tr>
                <th>{labels.fields.maKhachHang}</th>
                <th>{labels.fields.tenKhachHang}</th>
                <th>{labels.fields.soDt}</th>
                <th>{labels.fields.maSoThue}</th>
                <th>{labels.fields.diaChi}</th>
                <th>{labels.fields.maQuanHeNganSach}</th>
                <th>{labels.fields.cccd}</th>
                <th>{labels.fields.ngayTao}</th>
                <th>{labels.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="9">{labels.empty}</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.maKhachHang}>
                    <td>{item.maKhachHang}</td>
                    <td>{item.tenKhachHang}</td>
                    <td>{item.soDt || ''}</td>
                    <td>{item.maSoThue || ''}</td>
                    <td>{item.diaChi || ''}</td>
                    <td>{item.maQuanHeNganSach || ''}</td>
                    <td>{item.cccd || ''}</td>
                    <td>{formatDateTime(item.ngayTao)}</td>
                    <td>
                      <div className="unit-row-actions">
                        <button type="button" onClick={() => handleEdit(item)}>{labels.edit}</button>
                        <button type="button" onClick={() => handleDelete(item.maKhachHang)}>{labels.delete}</button>
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
  return value ? new Date(value).toLocaleString('vi-VN') : ''
}

function getErrorMessage(error, fallbackMessage) {
  const data = error.response?.data
  if (!data) {
    return fallbackMessage
  }

  if (typeof data === 'string') {
    return data
  }

  if (data.message) {
    return data.message
  }

  const firstError = Object.values(data).find(Boolean)
  return firstError || fallbackMessage
}

export default KhachHangPage
