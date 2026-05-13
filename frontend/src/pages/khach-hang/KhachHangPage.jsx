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
    setFormData((current) => ({
      ...current,
      [name]: name === 'tenKhachHang' ? value.toUpperCase() : value,
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
      const errMsg = error.response?.data?.message || labels.messages.saveFailed
      setMessage(errMsg)
      toast.error(errMsg)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
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
          <label>
            {labels.fields.tenKhachHang}
            <input name="tenKhachHang" value={formData.tenKhachHang} onChange={handleChange} placeholder={labels.placeholders.tenKhachHang} required />
          </label>

          <label>
            {labels.fields.soDt}
            <input name="soDt" value={formData.soDt} onChange={handleChange} placeholder={labels.placeholders.soDt} />
          </label>

          <label>
            {labels.fields.maSoThue}
            <input name="maSoThue" value={formData.maSoThue} onChange={handleChange} placeholder={labels.placeholders.maSoThue} />
          </label>

          <label>
            {labels.fields.diaChi}
            <input name="diaChi" value={formData.diaChi} onChange={handleChange} placeholder={labels.placeholders.diaChi} />
          </label>

          <label>
            {labels.fields.maQuanHeNganSach}
            <input name="maQuanHeNganSach" value={formData.maQuanHeNganSach} onChange={handleChange} placeholder={labels.placeholders.maQuanHeNganSach} />
          </label>

          <label>
            {labels.fields.cccd}
            <input name="cccd" value={formData.cccd} onChange={handleChange} placeholder={labels.placeholders.cccd} />
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

export default KhachHangPage
