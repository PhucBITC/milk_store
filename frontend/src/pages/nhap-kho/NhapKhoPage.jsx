import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import './NhapKhoPage.css'

const API = 'http://localhost:8080'

function NhapKhoPage() {
  const [activeTab, setActiveTab] = useState('tao-phieu') // 'tao-phieu' | 'danh-sach' | 'the-kho'

  // ── STATE: Tạo phiếu nhập ──
  const [warehouses, setWarehouses] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ maKho: '', maNhaCungCap: '', maNhanVien: '', ghiChu: '' })
  const [cartItems, setCartItems] = useState([]) // [ { maHangHoa, tenHangHoa, soLuong, donGia, donViTinh } ]
  const [selectedProduct, setSelectedProduct] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── STATE: Danh sách phiếu ──
  const [phieuList, setPhieuList] = useState([])
  const [loadingPhieu, setLoadingPhieu] = useState(false)
  const [selectedPhieu, setSelectedPhieu] = useState(null)
  const [searchPhieu, setSearchPhieu] = useState('')

  // ── STATE: Thẻ kho ──
  const [theKhoList, setTheKhoList] = useState([])
  const [loadingTheKho, setLoadingTheKho] = useState(false)
  const [filterKho, setFilterKho] = useState('')
  const [filterLoai, setFilterLoai] = useState('')

  // ── Load dữ liệu ban đầu ──
  useEffect(() => {
    fetch(`${API}/api/kho`).then(r => r.json()).then(setWarehouses).catch(() => {})
    fetch(`${API}/api/nha-cung-cap`).then(r => r.json()).then(d => setSuppliers(Array.isArray(d) ? d : d.data || [])).catch(() => {})
    fetch(`${API}/api/hang-hoa`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : d.data || [])).catch(() => {})
  }, [])

  // ── Load danh sách phiếu khi chuyển tab ──
  const loadPhieu = useCallback(async () => {
    setLoadingPhieu(true)
    try {
      const res = await fetch(`${API}/api/nhap-kho`)
      const data = await res.json()
      setPhieuList(Array.isArray(data) ? data : [])
    } catch { toast.error('Không thể tải danh sách phiếu nhập') }
    finally { setLoadingPhieu(false) }
  }, [])

  // ── Load thẻ kho ──
  const loadTheKho = useCallback(async () => {
    setLoadingTheKho(true)
    try {
      const url = filterKho
        ? `${API}/api/the-kho/kho/${filterKho}`
        : `${API}/api/the-kho/loai/${filterLoai || 'NHAP'}`
      const res = await fetch(url)
      const data = await res.json()
      setTheKhoList(Array.isArray(data) ? data : [])
    } catch { toast.error('Không thể tải thẻ kho') }
    finally { setLoadingTheKho(false) }
  }, [filterKho, filterLoai])

  useEffect(() => {
    if (activeTab === 'danh-sach') loadPhieu()
    if (activeTab === 'the-kho') loadTheKho()
  }, [activeTab, loadPhieu, loadTheKho])

  // ── Thêm sản phẩm vào giỏ nhập ──
  const handleAddProduct = () => {
    if (!selectedProduct) return
    const prod = products.find(p => p.maHang === selectedProduct)
    if (!prod) return
    if (cartItems.find(c => c.maHangHoa === selectedProduct)) {
      toast.warning('Mặt hàng này đã có trong phiếu!')
      return
    }
    setCartItems(prev => [...prev, {
      maHangHoa: prod.maHang,
      tenHangHoa: prod.tenHang,
      soLuong: 1,
      donGia: prod.giaNhap || 0,
      donViTinh: prod.dvt1 || 'Cái',
    }])
    setSelectedProduct('')
  }

  const updateItem = (idx, field, value) => {
    setCartItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const removeItem = (idx) => setCartItems(prev => prev.filter((_, i) => i !== idx))

  const tongTien = cartItems.reduce((s, i) => s + (Number(i.soLuong) * Number(i.donGia)), 0)

  // ── Lưu phiếu nhập ──
  const handleSubmit = async () => {
    if (!form.maKho) { toast.warning('Vui lòng chọn kho nhập!'); return }
    if (cartItems.length === 0) { toast.warning('Vui lòng thêm ít nhất 1 mặt hàng!'); return }
    const invalid = cartItems.some(i => !i.soLuong || Number(i.soLuong) <= 0)
    if (invalid) { toast.warning('Số lượng phải lớn hơn 0!'); return }

    setSubmitting(true)
    try {
      const body = {
        ...form,
        items: cartItems.map(i => ({
          maHangHoa: i.maHangHoa,
          soLuong: Number(i.soLuong),
          donGia: Number(i.donGia),
          donViTinh: i.donViTinh,
        }))
      }
      const res = await fetch(`${API}/api/nhap-kho`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Lỗi khi lưu phiếu')
      const data = await res.json()
      toast.success(`Đã lưu phiếu nhập ${data.maPhieu} thành công!`)
      setCartItems([])
      setForm({ maKho: '', maNhaCungCap: '', maNhanVien: '', ghiChu: '' })
    } catch (e) {
      toast.error('Lỗi: ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Xóa phiếu nhập ──
  const handleDeletePhieu = async (maPhieu) => {
    if (!window.confirm(`Hủy phiếu ${maPhieu}? Kho sẽ được hoàn lại số lượng.`)) return
    try {
      await fetch(`${API}/api/nhap-kho/${maPhieu}`, { method: 'DELETE' })
      toast.success(`Đã hủy phiếu ${maPhieu} và hoàn kho!`)
      loadPhieu()
    } catch { toast.error('Lỗi khi hủy phiếu') }
  }

  const filteredPhieu = phieuList.filter(p =>
    p.maPhieu?.toLowerCase().includes(searchPhieu.toLowerCase()) ||
    p.tenKho?.toLowerCase().includes(searchPhieu.toLowerCase()) ||
    p.tenNhaCungCap?.toLowerCase().includes(searchPhieu.toLowerCase())
  )

  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + ' ₫'
  const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—'
  const fmtQty = (n) => (Number(n || 0) > 0 ? '+' : '') + Number(n || 0).toLocaleString('vi-VN')

  return (
    <div className="nhap-kho-page">
      {/* Header */}
      <div className="nk-header">
        <div>
          <h2>NHẬP KHO HÀNG HÓA</h2>
          <p>Quản lý phiếu nhập, cập nhật tồn kho và truy vết biến động</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="nk-tabs">
        <button className={activeTab === 'tao-phieu' ? 'active' : ''} onClick={() => setActiveTab('tao-phieu')}>
          TẠO PHIẾU NHẬP
        </button>
        <button className={activeTab === 'danh-sach' ? 'active' : ''} onClick={() => setActiveTab('danh-sach')}>
          DANH SÁCH PHIẾU
        </button>
        <button className={activeTab === 'the-kho' ? 'active' : ''} onClick={() => setActiveTab('the-kho')}>
          THẺ KHO (TRUY VẾT)
        </button>
      </div>

      {/* ── TAB 1: TẠO PHIẾU NHẬP ── */}
      {activeTab === 'tao-phieu' && (
        <div className="nk-body">
          <div className="nk-form-grid">
            {/* Cột trái: Thông tin phiếu */}
            <div className="nk-card">
              <div className="nk-card-header">
                <h3>THÔNG TIN PHIẾU NHẬP</h3>
              </div>
              <div className="nk-card-body">
                <div className="form-row">
                  <label>Chi nhánh nhập vào *</label>
                  <select value={form.maKho} onChange={e => setForm(f => ({ ...f, maKho: e.target.value }))}>
                    <option value="">-- Chọn kho / chi nhánh --</option>
                    {warehouses.map(w => (
                      <option key={w.maKho} value={w.maKho}>{w.tenKho} ({w.maKho})</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Nhà cung cấp</label>
                  <select value={form.maNhaCungCap} onChange={e => setForm(f => ({ ...f, maNhaCungCap: e.target.value }))}>
                    <option value="">-- Không có NCC --</option>
                    {suppliers.map(s => (
                      <option key={s.maNhaCungCap} value={s.maNhaCungCap}>{s.tenNhaCungCap}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Nhân viên nhập kho</label>
                  <input
                    type="text"
                    placeholder="Tên hoặc mã nhân viên"
                    value={form.maNhanVien}
                    onChange={e => setForm(f => ({ ...f, maNhanVien: e.target.value }))}
                  />
                </div>
                <div className="form-row">
                  <label>Ghi chú</label>
                  <textarea
                    placeholder="Ghi chú về đợt nhập hàng này..."
                    value={form.ghiChu}
                    onChange={e => setForm(f => ({ ...f, ghiChu: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Cột phải: Chọn hàng hóa */}
            <div className="nk-card">
              <div className="nk-card-header">
                <h3>CHỌN HÀNG HÓA NHẬP</h3>
              </div>
              <div className="nk-card-body">
                <div className="product-selector">
                  <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                    <option value="">-- Tìm và chọn mặt hàng --</option>
                    {products.map(p => (
                      <option key={p.maHang} value={p.maHang}>
                        [{p.maHang}] {p.tenHang}
                      </option>
                    ))}
                  </select>
                  <button className="btn-add-item" onClick={handleAddProduct}>+ Thêm</button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="empty-cart">Chưa có mặt hàng nào trong phiếu</div>
                ) : (
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Mặt hàng</th>
                        <th>DVT</th>
                        <th>Số lượng</th>
                        <th>Đơn giá (₫)</th>
                        <th>Thành tiền</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, idx) => (
                        <tr key={item.maHangHoa}>
                          <td>
                            <div className="item-name">{item.tenHangHoa}</div>
                            <div className="item-code">{item.maHangHoa}</div>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input-sm"
                              value={item.donViTinh}
                              onChange={e => updateItem(idx, 'donViTinh', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-sm"
                              min="1"
                              value={item.soLuong}
                              onChange={e => updateItem(idx, 'soLuong', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-sm"
                              min="0"
                              value={item.donGia}
                              onChange={e => updateItem(idx, 'donGia', e.target.value)}
                            />
                          </td>
                          <td className="col-total">
                            {Number(item.soLuong * item.donGia).toLocaleString('vi-VN')}
                          </td>
                          <td>
                            <button className="btn-remove" onClick={() => removeItem(idx)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Footer tổng tiền + lưu */}
          <div className="nk-footer">
            <div className="tong-tien">
              <span>TỔNG GIÁ TRỊ NHẬP KHO:</span>
              <strong>{fmt(tongTien)}</strong>
              <span className="sl-items">{cartItems.length} mặt hàng</span>
            </div>
            <button
              className="btn-save-phieu"
              onClick={handleSubmit}
              disabled={submitting || !form.maKho || cartItems.length === 0}
            >
              {submitting ? 'Đang lưu...' : 'LƯU PHIẾU NHẬP KHO'}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: DANH SÁCH PHIẾU ── */}
      {activeTab === 'danh-sach' && (
        <div className="nk-body">
          <div className="nk-toolbar">
            <input
              type="text"
              placeholder="Tìm theo mã phiếu, kho, nhà cung cấp..."
              value={searchPhieu}
              onChange={e => setSearchPhieu(e.target.value)}
              className="search-input"
            />
            <button className="btn-refresh" onClick={loadPhieu}>Làm mới</button>
          </div>

          <div className="nk-card">
            {loadingPhieu ? (
              <div className="loading-state">Đang tải danh sách phiếu...</div>
            ) : filteredPhieu.length === 0 ? (
              <div className="empty-state">Chưa có phiếu nhập nào</div>
            ) : (
              <table className="nk-table">
                <thead>
                  <tr>
                    <th>Mã phiếu</th>
                    <th>Chi nhánh</th>
                    <th>Nhà cung cấp</th>
                    <th>Nhân viên</th>
                    <th>Ngày nhập</th>
                    <th>Tổng tiền</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhieu.map(p => (
                    <>
                      <tr key={p.maPhieu} className={selectedPhieu?.maPhieu === p.maPhieu ? 'row-selected' : ''}>
                        <td><span className="code-tag">{p.maPhieu}</span></td>
                        <td>{p.tenKho || p.maKho}</td>
                        <td>{p.tenNhaCungCap || p.maNhaCungCap || '—'}</td>
                        <td>{p.maNhanVien || '—'}</td>
                        <td>{fmtDate(p.ngayNhap)}</td>
                        <td><strong className="money">{fmt(p.tongTien)}</strong></td>
                        <td>
                          <button
                            className="btn-text view"
                            onClick={() => setSelectedPhieu(selectedPhieu?.maPhieu === p.maPhieu ? null : p)}
                          >
                            {selectedPhieu?.maPhieu === p.maPhieu ? 'Ẩn' : 'Chi tiết'}
                          </button>
                          <button className="btn-text delete" onClick={() => handleDeletePhieu(p.maPhieu)}>
                            Hủy
                          </button>
                        </td>
                      </tr>
                      {selectedPhieu?.maPhieu === p.maPhieu && p.chiTietList?.length > 0 && (
                        <tr key={`${p.maPhieu}-detail`} className="detail-row">
                          <td colSpan={7}>
                            <div className="detail-panel">
                              <strong>Chi tiết phiếu {p.maPhieu}</strong>
                              <table className="detail-table">
                                <thead>
                                  <tr>
                                    <th>Mã hàng</th>
                                    <th>Tên hàng</th>
                                    <th>DVT</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {p.chiTietList.map(ct => (
                                    <tr key={ct.id}>
                                      <td><span className="code-tag">{ct.maHangHoa}</span></td>
                                      <td>{ct.tenHangHoa}</td>
                                      <td>{ct.donViTinh}</td>
                                      <td>{Number(ct.soLuong).toLocaleString('vi-VN')}</td>
                                      <td>{fmt(ct.donGia)}</td>
                                      <td><strong>{fmt(ct.thanhTien)}</strong></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {p.ghiChu && <p className="phieu-note">Ghi chú: {p.ghiChu}</p>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: THẺ KHO ── */}
      {activeTab === 'the-kho' && (
        <div className="nk-body">
          <div className="nk-toolbar">
            <select value={filterKho} onChange={e => { setFilterKho(e.target.value); setFilterLoai('') }}>
              <option value="">-- Lọc theo kho --</option>
              {warehouses.map(w => (
                <option key={w.maKho} value={w.maKho}>{w.tenKho}</option>
              ))}
            </select>
            <select value={filterLoai} onChange={e => { setFilterLoai(e.target.value); setFilterKho('') }}
              disabled={!!filterKho}>
              <option value="NHAP">NHẬP KHO</option>
              <option value="XUAT">XUẤT BÁN</option>
              <option value="HOAN">HOÀN KHO</option>
              <option value="CHUYEN">ĐIỀU CHUYỂN</option>
            </select>
            <button className="btn-refresh" onClick={loadTheKho}>Tải nhật ký</button>
          </div>

          <div className="nk-card">
            {loadingTheKho ? (
              <div className="loading-state">Đang tải nhật ký kho...</div>
            ) : theKhoList.length === 0 ? (
              <div className="empty-state">Chưa có biến động nào được ghi nhận</div>
            ) : (
              <table className="nk-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Mặt hàng</th>
                    <th>Chi nhánh</th>
                    <th>Loại</th>
                    <th>Số phiếu</th>
                    <th>Biến động</th>
                    <th>Tồn cuối</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {theKhoList.map(tk => (
                    <tr key={tk.id}>
                      <td className="col-date">{fmtDate(tk.ngayThucHien)}</td>
                      <td>
                        <div className="item-name">{tk.tenHangHoa || tk.maHangHoa}</div>
                        <div className="item-code">{tk.maHangHoa}</div>
                      </td>
                      <td>{tk.tenKho || tk.maKho}</td>
                      <td>
                        <span className={`badge loai-${tk.loaiPhieu?.toLowerCase()}`}>
                          {tk.loaiPhieu}
                        </span>
                      </td>
                      <td><span className="code-tag">{tk.soPhieu}</span></td>
                      <td className={Number(tk.soLuongThayDoi) >= 0 ? 'qty-positive' : 'qty-negative'}>
                        {fmtQty(tk.soLuongThayDoi)}
                      </td>
                      <td><strong>{Number(tk.tonCuoi || 0).toLocaleString('vi-VN')}</strong></td>
                      <td className="col-note">{tk.ghiChu || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NhapKhoPage
