import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import './WarehouseManagement.css'

const API = 'http://localhost:8080'

function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState('chi-nhanh')

  // ── Chi nhánh ──
  const [warehouses, setWarehouses] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingKho, setEditingKho] = useState(null)
  const [newKho, setNewKho] = useState({ maKho: '', tenKho: '', canhBao: 0 })
  const [selectedUser, setSelectedUser] = useState('')
  const [userPermissions, setUserPermissions] = useState([])

  // ── Tồn kho ──
  const [tonKhoList, setTonKhoList] = useState([])
  const [filterKhoTon, setFilterKhoTon] = useState('')

  // ── Hàng nhập ──
  const [nhapList, setNhapList] = useState([])
  const [filterKhoNhap, setFilterKhoNhap] = useState('')

  // ── Hàng bán ──
  const [banList, setBanList] = useState([])
  const [filterKhoBan, setFilterKhoBan] = useState('')

  // ── Điều chuyển ──
  const [chuyenList, setChuyenList] = useState([])
  const [showChuyenModal, setShowChuyenModal] = useState(false)
  const [products, setProducts] = useState([])
  const [chuyenForm, setChuyenForm] = useState({
    maHangHoa: '', maKhoNguon: '', maKhoDich: '',
    soLuong: '', donViTinh: '', maNhanVien: '', lyDo: ''
  })

  // ─── Load ban đầu ───
  useEffect(() => {
    fetchBase()
    fetch(`${API}/api/hang-hoa`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : d.data || [])).catch(() => {})
  }, [])

  const fetchBase = async () => {
    try {
      setLoading(true)
      const [khoRes, userRes] = await Promise.all([
        fetch(`${API}/api/kho`),
        fetch(`${API}/api/users`)
      ])
      setWarehouses(await khoRes.json())
      if (userRes.ok) {
        const ud = await userRes.json()
        setUsers(Array.isArray(ud) ? ud : [])
      }
    } catch (e) { toast.error('Không thể tải dữ liệu: ' + e.message) }
    finally { setLoading(false) }
  }

  // ─── Load theo tab ───
  const loadTonKho = useCallback(async () => {
    const url = filterKhoTon ? `${API}/api/ton-kho/kho/${filterKhoTon}` : `${API}/api/ton-kho`
    const d = await fetch(url).then(r => r.json()).catch(() => [])
    setTonKhoList(Array.isArray(d) ? d : [])
  }, [filterKhoTon])

  const loadNhap = useCallback(async () => {
    const url = filterKhoNhap ? `${API}/api/kho-van-hanh/nhap/kho/${filterKhoNhap}` : `${API}/api/kho-van-hanh/nhap`
    const d = await fetch(url).then(r => r.json()).catch(() => [])
    setNhapList(Array.isArray(d) ? d : [])
  }, [filterKhoNhap])

  const loadBan = useCallback(async () => {
    const url = filterKhoBan ? `${API}/api/kho-van-hanh/ban/kho/${filterKhoBan}` : `${API}/api/kho-van-hanh/ban`
    const d = await fetch(url).then(r => r.json()).catch(() => [])
    setBanList(Array.isArray(d) ? d : [])
  }, [filterKhoBan])

  const loadChuyen = useCallback(async () => {
    const d = await fetch(`${API}/api/kho-van-hanh/chuyen`).then(r => r.json()).catch(() => [])
    setChuyenList(Array.isArray(d) ? d : [])
  }, [])

  useEffect(() => {
    if (activeTab === 'ton-kho') loadTonKho()
    if (activeTab === 'nhap') loadNhap()
    if (activeTab === 'ban') loadBan()
    if (activeTab === 'chuyen') loadChuyen()
  }, [activeTab, loadTonKho, loadNhap, loadBan, loadChuyen])

  // ─── CRUD Chi nhánh ───
  const handleSaveKho = async () => {
    if (!newKho.maKho || !newKho.tenKho) { toast.warn('Vui lòng nhập Mã và Tên kho'); return }
    const method = editingKho ? 'PUT' : 'POST'
    const url = editingKho ? `${API}/api/kho/${editingKho.maKho}` : `${API}/api/kho`
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newKho) })
    if (res.ok) {
      toast.success(editingKho ? 'Cập nhật kho thành công' : 'Thêm kho mới thành công')
      setShowModal(false); setEditingKho(null); setNewKho({ maKho: '', tenKho: '', canhBao: 0 }); fetchBase()
    }
  }

  const handleDeleteKho = async (id) => {
    if (!window.confirm('Xóa kho này?')) return
    await fetch(`${API}/api/kho/${id}`, { method: 'DELETE' })
    toast.success('Đã xóa kho'); fetchBase()
  }

  const loadUserPermissions = async (username) => {
    setSelectedUser(username)
    const res = await fetch(`${API}/api/kho/user/${username}`).then(r => r.json()).catch(() => [])
    setUserPermissions(Array.isArray(res) ? res.map(k => k.maKho) : [])
  }

  const togglePermission = (maKho) =>
    setUserPermissions(prev => prev.includes(maKho) ? prev.filter(id => id !== maKho) : [...prev, maKho])

  const savePermissions = async () => {
    if (!selectedUser) return
    const payload = userPermissions.map(maKho => ({ maNhanVien: selectedUser, maKho, chonDung: 1 }))
    const res = await fetch(`${API}/api/kho/permissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) toast.success('Đã cập nhật quyền cho ' + selectedUser)
  }

  // ─── Điều chuyển kho ───
  const handleChuyen = async () => {
    const { maHangHoa, maKhoNguon, maKhoDich, soLuong } = chuyenForm
    if (!maHangHoa || !maKhoNguon || !maKhoDich || !soLuong) { toast.warn('Vui lòng điền đầy đủ thông tin'); return }
    if (maKhoNguon === maKhoDich) { toast.warn('Kho nguồn và kho đích không được trùng!'); return }
    const res = await fetch(`${API}/api/kho-van-hanh/chuyen`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...chuyenForm, soLuong: Number(soLuong) })
    })
    if (res.ok) {
      toast.success('Điều chuyển kho thành công!')
      setShowChuyenModal(false)
      setChuyenForm({ maHangHoa: '', maKhoNguon: '', maKhoDich: '', soLuong: '', donViTinh: '', maNhanVien: '', lyDo: '' })
      loadChuyen()
    } else { toast.error('Lỗi khi điều chuyển') }
  }

  // ─── Helpers ───
  const fmt = n => Number(n || 0).toLocaleString('vi-VN') + ' ₫'
  const fmtQty = n => Number(n || 0).toLocaleString('vi-VN')
  const fmtDate = d => d ? new Date(d).toLocaleString('vi-VN') : '—'

  const KhoFilter = ({ value, onChange, label }) => (
    <select className="wm-filter-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{label}</option>
      {warehouses.map(w => <option key={w.maKho} value={w.maKho}>{w.tenKho}</option>)}
    </select>
  )

  return (
    <div className="wm-page">
      {/* Header */}
      <div className="wm-header">
        <div>
          <h2>HỆ THỐNG QUẢN LÝ KHO HÀNG</h2>
          <p>Tồn kho, nhập kho, xuất bán và điều chuyển giữa các chi nhánh</p>
        </div>
        {activeTab === 'chi-nhanh' && (
          <button className="btn-primary-action" onClick={() => { setEditingKho(null); setNewKho({ maKho: '', tenKho: '', canhBao: 0 }); setShowModal(true) }}>
            + Thêm chi nhánh
          </button>
        )}
        {activeTab === 'chuyen' && (
          <button className="btn-primary-action" onClick={() => setShowChuyenModal(true)}>
            + Tạo lệnh điều chuyển
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="wm-tabs">
        {[
          { key: 'chi-nhanh', label: 'CHI NHÁNH & PHÂN QUYỀN' },
          { key: 'ton-kho',   label: 'TỒN KHO THEO THỜI GIAN THỰC' },
          { key: 'nhap',      label: 'HÀNG HÓA NHẬP KHO' },
          { key: 'ban',       label: 'HÀNG HÓA BÁN RA' },
          { key: 'chuyen',    label: 'ĐIỀU CHUYỂN KHO' },
        ].map(t => (
          <button key={t.key} className={activeTab === t.key ? 'active' : ''} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: CHI NHÁNH & PHÂN QUYỀN ── */}
      {activeTab === 'chi-nhanh' && (
        <div className="wm-grid">
          <div className="wm-card">
            <div className="wm-card-header"><h3>DANH SÁCH CHI NHÁNH ({warehouses.length})</h3></div>
            {loading ? <div className="wm-empty">Đang tải...</div> : warehouses.length === 0 ? (
              <div className="wm-empty">Chưa có chi nhánh nào.</div>
            ) : (
              <table className="wm-table">
                <thead><tr><th>Mã kho</th><th>Tên chi nhánh</th><th style={{textAlign:'right'}}>Hành động</th></tr></thead>
                <tbody>
                  {warehouses.map(k => (
                    <tr key={k.maKho}>
                      <td><span className="code-tag">{k.maKho}</span></td>
                      <td><strong>{k.tenKho}</strong></td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn-text edit" onClick={() => { setEditingKho(k); setNewKho(k); setShowModal(true) }}>Sửa</button>
                        <button className="btn-text delete" onClick={() => handleDeleteKho(k.maKho)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="wm-card">
            <div className="wm-card-header"><h3>PHÂN QUYỀN NHÂN VIÊN</h3></div>
            <div className="perm-body">
              <select className="wm-filter-select" value={selectedUser} onChange={e => loadUserPermissions(e.target.value)}>
                <option value="">-- Chọn nhân viên cần gán quyền --</option>
                {users.map(u => <option key={u.maTaiKhoan} value={u.maTaiKhoan}>{u.tenTaiKhoan} ({u.maTaiKhoan})</option>)}
              </select>
              {selectedUser ? (
                <div className="perm-area">
                  <p className="perm-hint">Chọn các chi nhánh được phép làm việc:</p>
                  <div className="perm-chips">
                    {warehouses.map(k => (
                      <label key={k.maKho} className={`perm-chip ${userPermissions.includes(k.maKho) ? 'active' : ''}`}>
                        <input type="checkbox" checked={userPermissions.includes(k.maKho)} onChange={() => togglePermission(k.maKho)} />
                        <span className="chip-name">{k.tenKho}</span>
                        <span className="chip-code">#{k.maKho}</span>
                      </label>
                    ))}
                  </div>
                  <button className="btn-save-perms" onClick={savePermissions}>Lưu phân quyền</button>
                </div>
              ) : <div className="wm-empty">Chọn nhân viên để thiết lập quyền truy cập.</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: TỒN KHO ── */}
      {activeTab === 'ton-kho' && (
        <div className="wm-body">
          <div className="wm-toolbar">
            <KhoFilter value={filterKhoTon} onChange={setFilterKhoTon} label="-- Tất cả chi nhánh --" />
            <button className="btn-refresh" onClick={loadTonKho}>Làm mới</button>
            <span className="summary-badge">{tonKhoList.length} mặt hàng</span>
          </div>
          <div className="wm-card">
            {tonKhoList.length === 0 ? <div className="wm-empty">Chưa có dữ liệu tồn kho</div> : (
              <table className="wm-table">
                <thead><tr><th>Mã hàng</th><th>Tên hàng hóa</th><th>Chi nhánh</th><th>Tồn hiện tại</th><th>Giá vốn</th><th>Giá trị tồn</th></tr></thead>
                <tbody>
                  {tonKhoList.map((t, i) => (
                    <tr key={i}>
                      <td><span className="code-tag">{t.maHangHoa}</span></td>
                      <td>{t.tenHangHoa || t.maHangHoa}</td>
                      <td>{t.tenKho || t.maKho}</td>
                      <td className={Number(t.soLuongTong) <= 0 ? 'qty-zero' : 'qty-ok'}>
                        <strong>{fmtQty(t.soLuongTong)}</strong>
                      </td>
                      <td>{t.donGia ? fmt(t.donGia) : '—'}</td>
                      <td><strong className="money">{t.giaTriTon ? fmt(t.giaTriTon) : '—'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: HÀNG NHẬP ── */}
      {activeTab === 'nhap' && (
        <div className="wm-body">
          <div className="wm-toolbar">
            <KhoFilter value={filterKhoNhap} onChange={setFilterKhoNhap} label="-- Tất cả chi nhánh --" />
            <button className="btn-refresh" onClick={loadNhap}>Làm mới</button>
            <span className="summary-badge">{nhapList.length} dòng</span>
          </div>
          <div className="wm-card">
            {nhapList.length === 0 ? <div className="wm-empty">Chưa có dữ liệu nhập kho</div> : (
              <table className="wm-table">
                <thead><tr><th>Ngày nhập</th><th>Mã phiếu</th><th>Mặt hàng</th><th>Chi nhánh</th><th>Nhà CC</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th><th>Nhân viên</th></tr></thead>
                <tbody>
                  {nhapList.map(r => (
                    <tr key={r.id}>
                      <td className="col-date">{fmtDate(r.ngayNhap)}</td>
                      <td><span className="code-tag">{r.maPhieuNhap}</span></td>
                      <td><div className="item-name">{r.maHangHoa}</div></td>
                      <td>{r.maKho}</td>
                      <td>{r.maNhaCungCap || '—'}</td>
                      <td className="qty-ok"><strong>{fmtQty(r.soLuong)}</strong></td>
                      <td>{r.donGia ? fmt(r.donGia) : '—'}</td>
                      <td><strong className="money">{r.thanhTien ? fmt(r.thanhTien) : '—'}</strong></td>
                      <td>{r.maNhanVien || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: HÀNG BÁN ── */}
      {activeTab === 'ban' && (
        <div className="wm-body">
          <div className="wm-toolbar">
            <KhoFilter value={filterKhoBan} onChange={setFilterKhoBan} label="-- Tất cả chi nhánh --" />
            <button className="btn-refresh" onClick={loadBan}>Làm mới</button>
            <span className="summary-badge">{banList.length} dòng</span>
          </div>
          <div className="wm-card">
            {banList.length === 0 ? <div className="wm-empty">Chưa có dữ liệu bán hàng</div> : (
              <table className="wm-table">
                <thead><tr><th>Ngày bán</th><th>Hóa đơn</th><th>Mặt hàng</th><th>Chi nhánh</th><th>Khách hàng</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th><th>Thanh toán</th></tr></thead>
                <tbody>
                  {banList.map(r => (
                    <tr key={r.id}>
                      <td className="col-date">{fmtDate(r.ngayBan)}</td>
                      <td><span className="code-tag">{r.maHoaDon}</span></td>
                      <td><div className="item-name">{r.maHangHoa}</div></td>
                      <td>{r.maKho}</td>
                      <td>{r.maKhachHang || 'Khách lẻ'}</td>
                      <td className="qty-negative"><strong>-{fmtQty(r.soLuong)}</strong></td>
                      <td>{r.donGia ? fmt(r.donGia) : '—'}</td>
                      <td><strong className="money">{r.thanhTien ? fmt(r.thanhTien) : '—'}</strong></td>
                      <td><span className="badge-pay">{r.hinhThucThanhToan || '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: ĐIỀU CHUYỂN ── */}
      {activeTab === 'chuyen' && (
        <div className="wm-body">
          <div className="wm-toolbar">
            <button className="btn-refresh" onClick={loadChuyen}>Làm mới</button>
            <span className="summary-badge">{chuyenList.length} lệnh</span>
          </div>
          <div className="wm-card">
            {chuyenList.length === 0 ? <div className="wm-empty">Chưa có lệnh điều chuyển nào</div> : (
              <table className="wm-table">
                <thead><tr><th>Ngày chuyển</th><th>Mã lệnh</th><th>Mặt hàng</th><th>Kho nguồn</th><th>Kho đích</th><th>Số lượng</th><th>Nhân viên</th><th>Lý do</th><th>Trạng thái</th></tr></thead>
                <tbody>
                  {chuyenList.map(r => (
                    <tr key={r.id}>
                      <td className="col-date">{fmtDate(r.ngayChuyen)}</td>
                      <td><span className="code-tag">{r.maPhieuChuyen}</span></td>
                      <td><div className="item-name">{r.maHangHoa}</div></td>
                      <td>{r.maKhoNguon}</td>
                      <td>{r.maKhoDich}</td>
                      <td className="qty-ok"><strong>{fmtQty(r.soLuong)}</strong></td>
                      <td>{r.maNhanVien || '—'}</td>
                      <td className="col-note">{r.lyDo || '—'}</td>
                      <td><span className={`badge-status ${r.trangThai?.toLowerCase()}`}>{r.trangThai}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal thêm/sửa kho */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>{editingKho ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh mới'}</h3>
            <div className="modal-form">
              <label>Mã kho *</label>
              <input disabled={!!editingKho} value={newKho.maKho} onChange={e => setNewKho({...newKho, maKho: e.target.value})} placeholder="vd: 01" />
              <label>Tên chi nhánh *</label>
              <input value={newKho.tenKho} onChange={e => setNewKho({...newKho, tenKho: e.target.value})} placeholder="vd: Mẹ Xíu - Quận 1" />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSaveKho}>Lưu lại</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal điều chuyển kho */}
      {showChuyenModal && (
        <div className="modal-overlay" onClick={() => setShowChuyenModal(false)}>
          <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
            <h3>Tạo lệnh điều chuyển kho</h3>
            <div className="modal-form">
              <label>Mặt hàng *</label>
              <select value={chuyenForm.maHangHoa} onChange={e => setChuyenForm(f => ({...f, maHangHoa: e.target.value}))}>
                <option value="">-- Chọn mặt hàng --</option>
                {products.map(p => <option key={p.maHang} value={p.maHang}>[{p.maHang}] {p.tenHang}</option>)}
              </select>
              <label>Kho nguồn (xuất đi) *</label>
              <select value={chuyenForm.maKhoNguon} onChange={e => setChuyenForm(f => ({...f, maKhoNguon: e.target.value}))}>
                <option value="">-- Chọn kho nguồn --</option>
                {warehouses.map(w => <option key={w.maKho} value={w.maKho}>{w.tenKho}</option>)}
              </select>
              <label>Kho đích (nhận về) *</label>
              <select value={chuyenForm.maKhoDich} onChange={e => setChuyenForm(f => ({...f, maKhoDich: e.target.value}))}>
                <option value="">-- Chọn kho đích --</option>
                {warehouses.filter(w => w.maKho !== chuyenForm.maKhoNguon).map(w => <option key={w.maKho} value={w.maKho}>{w.tenKho}</option>)}
              </select>
              <label>Số lượng *</label>
              <input type="number" min="1" value={chuyenForm.soLuong} onChange={e => setChuyenForm(f => ({...f, soLuong: e.target.value}))} placeholder="0" />
              <label>Đơn vị tính</label>
              <input value={chuyenForm.donViTinh} onChange={e => setChuyenForm(f => ({...f, donViTinh: e.target.value}))} placeholder="Cái / Hộp / Thùng" />
              <label>Nhân viên thực hiện</label>
              <input value={chuyenForm.maNhanVien} onChange={e => setChuyenForm(f => ({...f, maNhanVien: e.target.value}))} placeholder="Tên hoặc mã NV" />
              <label>Lý do điều chuyển</label>
              <input value={chuyenForm.lyDo} onChange={e => setChuyenForm(f => ({...f, lyDo: e.target.value}))} placeholder="Nhập lý do..." />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowChuyenModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleChuyen}>Xác nhận điều chuyển</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarehouseManagement
