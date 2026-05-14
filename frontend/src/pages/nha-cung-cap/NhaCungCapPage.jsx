import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  createNhaCungCap,
  deleteNhaCungCap,
  getNhaCungCapList,
  searchNhaCungCap,
  updateNhaCungCap,
} from '../../services/nhaCungCapService'

const emptyForm = {
  maNhaCungCap: '',
  tenNhaCungCap: '',
  maSoThue: '',
  diaChi: '',
  soDt: '',
  nhanVienSale: '',
}

const fallbackLabels = {
  menuTitle: 'Nhà cung cấp',
  pageTitle: 'Quản lý nhà cung cấp',
  eyebrow: 'Nhà cung cấp',
  title: 'Quản lý nhà cung cấp',
  description: 'Lưu thông tin đơn vị cung ứng, mã số thuế và nhân viên sale phụ trách.',
  addTitle: 'Thêm nhà cung cấp',
  editTitle: 'Sửa nhà cung cấp',
  listTitle: 'Danh sách nhà cung cấp',
  searchPlaceholder: 'Tìm theo mã, tên, SĐT hoặc mã số thuế',
  search: 'Tìm kiếm',
  submitCreate: 'Thêm mới',
  submitUpdate: 'Lưu thay đổi',
  cancel: 'Hủy',
  actions: 'Hành động',
  edit: 'Sửa',
  delete: 'Xóa',
  empty: 'Chưa có nhà cung cấp.',
  deleteConfirm: 'Xóa nhà cung cấp này?',
  searchResult: 'Kết quả tìm kiếm cho',
  fields: {
    maNhaCungCap: 'Mã nhà cung cấp',
    tenNhaCungCap: 'Tên nhà cung cấp',
    maSoThue: 'Mã số thuế',
    diaChi: 'Địa chỉ',
    soDt: 'SĐT',
    nhanVienSale: 'Sale phụ trách',
    ngayTao: 'Ngày tạo',
  },
  placeholders: {
    maNhaCungCap: 'VD: CongTyA_2026',
    tenNhaCungCap: 'VD: CÔNG TY SỮA ABC',
    maSoThue: 'VD: 0312345678',
    diaChi: 'VD: KCN Tân Bình, TP.HCM',
    soDt: 'VD: 028xxxxxxx',
    nhanVienSale: 'VD: Nguyễn Văn A - 090xxxxxxx',
  },
  messages: {
    loadFailed: 'Không thể tải danh sách nhà cung cấp.',
    created: 'Đã thêm nhà cung cấp.',
    updated: 'Đã cập nhật nhà cung cấp.',
    saveFailed: 'Không thể lưu nhà cung cấp.',
    deleted: 'Đã xóa nhà cung cấp.',
    deleteFailed: 'Không thể xóa nhà cung cấp.',
    searchFailed: 'Không thể tìm kiếm nhà cung cấp.',
  },
}

function NhaCungCapPage({ t = fallbackLabels }) {
  const labels = { ...fallbackLabels, ...t }
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingItem, setEditingItem] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')

  const loadItems = async () => {
    try {
      const response = await getNhaCungCapList()
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
      [name]: ['maNhaCungCap', 'tenNhaCungCap'].includes(name) ? value.toUpperCase() : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingItem) {
        await updateNhaCungCap(editingItem.maNhaCungCap, formData)
        toast.success(labels.messages.updated)
      } else {
        await createNhaCungCap(formData)
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
      maNhaCungCap: item.maNhaCungCap || '',
      tenNhaCungCap: item.tenNhaCungCap || '',
      maSoThue: item.maSoThue || '',
      diaChi: item.diaChi || '',
      soDt: item.soDt || '',
      nhanVienSale: item.nhanVienSale || '',
    })
    setMessage('')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setFormData(emptyForm)
    setMessage('')
  }

  const handleDelete = async (maNhaCungCap) => {
    if (!window.confirm(labels.deleteConfirm)) {
      return
    }

    try {
      await deleteNhaCungCap(maNhaCungCap)
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
        ? await searchNhaCungCap(keyword.trim())
        : await getNhaCungCapList()
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
            {labels.fields.tenNhaCungCap}
            <input name="tenNhaCungCap" value={formData.tenNhaCungCap} onChange={handleChange} placeholder={labels.placeholders.tenNhaCungCap} required />
          </label>

          <label>
            {labels.fields.maNhaCungCap}
            <input name="maNhaCungCap" value={formData.maNhaCungCap} onChange={handleChange} placeholder={labels.placeholders.maNhaCungCap} pattern="[\p{L}\p{N}_-]{2,50}" title="Mã nhà cung cấp chỉ gồm chữ, số, dấu gạch dưới hoặc gạch ngang, từ 2 đến 50 ký tự." required readOnly={Boolean(editingItem)} />
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
            {labels.fields.soDt}
            <input name="soDt" value={formData.soDt} onChange={handleChange} placeholder={labels.placeholders.soDt} inputMode="numeric" pattern="\d{8,15}" title="SĐT phải gồm 8 đến 15 chữ số." />
          </label>

          <label>
            {labels.fields.nhanVienSale}
            <input name="nhanVienSale" value={formData.nhanVienSale} onChange={handleChange} placeholder={labels.placeholders.nhanVienSale} />
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
                <th>{labels.fields.maNhaCungCap}</th>
                <th>{labels.fields.tenNhaCungCap}</th>
                <th>{labels.fields.maSoThue}</th>
                <th>{labels.fields.diaChi}</th>
                <th>{labels.fields.soDt}</th>
                <th>{labels.fields.nhanVienSale}</th>
                <th>{labels.fields.ngayTao}</th>
                <th>{labels.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8">{labels.empty}</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.maNhaCungCap}>
                    <td>{item.maNhaCungCap}</td>
                    <td>{item.tenNhaCungCap}</td>
                    <td>{item.maSoThue || ''}</td>
                    <td>{item.diaChi || ''}</td>
                    <td>{item.soDt || ''}</td>
                    <td>{item.nhanVienSale || ''}</td>
                    <td>{formatDateTime(item.ngayTao)}</td>
                    <td>
                      <div className="unit-row-actions">
                        <button type="button" onClick={() => handleEdit(item)}>{labels.edit}</button>
                        <button type="button" onClick={() => handleDelete(item.maNhaCungCap)}>{labels.delete}</button>
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

export default NhaCungCapPage
