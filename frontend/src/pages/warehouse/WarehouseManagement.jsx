import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import './WarehouseManagement.css'

function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingKho, setEditingKho] = useState(null)
  const [newKho, setNewKho] = useState({ maKho: '', tenKho: '', canhBao: 0 })

  // Phân quyền
  const [selectedUser, setSelectedUser] = useState('')
  const [userPermissions, setUserPermissions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [khoRes, userRes] = await Promise.all([
        fetch('http://localhost:8080/api/kho'),
        fetch('http://localhost:8080/api/users') // Giả sử có endpoint này
      ])
      
      const khoData = await khoRes.json()
      setWarehouses(khoData)
      
      if (userRes.ok) {
        const userData = await userRes.json()
        // Kiểm tra nếu userData là mảng thì mới set, tránh lỗi .map
        setUsers(Array.isArray(userData) ? userData : [])
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveKho = async () => {
    if (!newKho.maKho || !newKho.tenKho) {
      toast.warn('Vui lòng nhập đầy đủ Mã và Tên kho')
      return
    }

    try {
      const method = editingKho ? 'PUT' : 'POST'
      const url = editingKho 
        ? `http://localhost:8080/api/kho/${editingKho.maKho}`
        : 'http://localhost:8080/api/kho'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKho)
      })

      if (res.ok) {
        toast.success(editingKho ? 'Cập nhật kho thành công' : 'Thêm kho mới thành công')
        setShowModal(false)
        setEditingKho(null)
        setNewKho({ maKho: '', tenKho: '', canhBao: 0 })
        fetchData()
      }
    } catch (error) {
      toast.error('Lỗi: ' + error.message)
    }
  }

  const handleDeleteKho = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kho này?')) return
    try {
      const res = await fetch(`http://localhost:8080/api/kho/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Đã xóa kho')
        fetchData()
      }
    } catch (error) {
      toast.error('Lỗi khi xóa: ' + error.message)
    }
  }

  const loadUserPermissions = async (username) => {
    setSelectedUser(username)
    try {
      const res = await fetch(`http://localhost:8080/api/kho/user/${username}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setUserPermissions(data.map(k => k.maKho))
      } else {
        setUserPermissions([])
      }
    } catch (error) {
      toast.error('Lỗi tải quyền: ' + error.message)
    }
  }

  const togglePermission = (maKho) => {
    setUserPermissions(prev => 
      prev.includes(maKho) ? prev.filter(id => id !== maKho) : [...prev, maKho]
    )
  }

  const savePermissions = async () => {
    if (!selectedUser) return
    const payload = userPermissions.map(maKho => ({
      maNhanVien: selectedUser,
      maKho: maKho,
      chonDung: 1
    }))

    try {
      const res = await fetch('http://localhost:8080/api/kho/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) toast.success('Đã cập nhật quyền truy cập kho cho ' + selectedUser)
    } catch (error) {
      toast.error('Lỗi lưu quyền: ' + error.message)
    }
  }

  return (
    <div className="warehouse-mgmt-container">
      <div className="mgmt-header">
        <h2>Quản lý Kho & Phân quyền</h2>
        <button className="btn-add-kho" onClick={() => { setEditingKho(null); setNewKho({ maKho: '', tenKho: '', canhBao: 0 }); setShowModal(true); }}>
          + Thêm Kho mới
        </button>
      </div>

      <div className="mgmt-grid">
        {/* Danh sách kho */}
        <div className="mgmt-card">
          <div className="card-header">
            <h3>DANH SÁCH CHI NHÁNH ({warehouses.length})</h3>
            <span className="badge-info">Trạng thái: Hoạt động</span>
          </div>
          
          {warehouses.length === 0 ? (
            <div className="empty-state">
              Hệ thống chưa có chi nhánh nào được thiết lập.
            </div>
          ) : (
            <table className="mgmt-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Mã số</th>
                  <th>Tên chi nhánh / Kho hàng</th>
                  <th style={{ textAlign: 'right' }}>Hành động quản trị</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map(k => (
                  <tr key={k.maKho}>
                    <td><span className="code-tag">{k.maKho}</span></td>
                    <td><strong>{k.tenKho}</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-text edit" onClick={() => { setEditingKho(k); setNewKho(k); setShowModal(true); }}>
                        Chỉnh sửa
                      </button>
                      <button className="btn-text delete" onClick={() => handleDeleteKho(k.maKho)}>
                        Xóa bỏ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Phân quyền nhân viên */}
        <div className="mgmt-card">
          <div className="card-header">
            <h3>PHÂN QUYỀN TRUY CẬP</h3>
            <span className="badge-warning">Bảo mật</span>
          </div>
          
          <div className="side-content">
            <div className="user-selector">
              <select className="modern-select" value={selectedUser} onChange={(e) => loadUserPermissions(e.target.value)}>
                <option value="">-- CHỌN NHÂN VIÊN CẦN GÁN QUYỀN --</option>
                {users.map(u => (
                  <option key={u.maTaiKhoan} value={u.maTaiKhoan}>
                    {u.tenTaiKhoan} ({u.maTaiKhoan})
                  </option>
                ))}
                {!users.find(u => u.maTaiKhoan === 'admin') && <option value="admin">Quản trị viên (admin)</option>}
              </select>
            </div>

            {selectedUser ? (
              <div className="permissions-area">
                {warehouses.length === 0 ? (
                  <div className="no-data-msg">Không có chi nhánh để phân quyền.</div>
                ) : (
                  <>
                    <p className="selection-info">
                      Chọn các chi nhánh nhân viên được phép làm việc:
                    </p>
                    <div className="permissions-scroll">
                      {warehouses.map(k => (
                        <label key={k.maKho} className={`permission-chip ${userPermissions.includes(k.maKho) ? 'active' : ''}`}>
                          <input 
                            type="checkbox" 
                            checked={userPermissions.includes(k.maKho)} 
                            onChange={() => togglePermission(k.maKho)} 
                            style={{ width: '18px', height: '18px', accentColor: 'var(--success-action)' }}
                          />
                          <div className="chip-content">
                            <span className="chip-name">{k.tenKho}</span>
                            <span className="chip-code">#{k.maKho}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button 
                      className="btn-save-perms" 
                      onClick={savePermissions}
                      disabled={warehouses.length === 0}
                    >
                      Cập nhật quyền hạn cho nhân viên
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="select-prompt">
                Vui lòng chọn một nhân viên để thiết lập quyền truy cập.
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingKho ? 'Cập nhật kho' : 'Thêm kho mới'}</h3>
            <div className="form-group">
              <label>Mã Kho:</label>
              <input 
                disabled={editingKho} 
                value={newKho.maKho} 
                onChange={e => setNewKho({...newKho, maKho: e.target.value})} 
                placeholder="vd: 01"
              />
            </div>
            <div className="form-group">
              <label>Tên Kho:</label>
              <input 
                value={newKho.tenKho} 
                onChange={e => setNewKho({...newKho, tenKho: e.target.value})} 
                placeholder="vd: Mẹ Xíu 1"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleSaveKho}>Lưu lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarehouseManagement
