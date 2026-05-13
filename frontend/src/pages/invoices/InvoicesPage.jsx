import { useState } from 'react'
import { toast } from 'react-toastify'
import './InvoicesPage.css'

// Giao diện Lịch sử Hóa đơn sang trọng và trọn vẹn
function InvoicesPage() {
  const [invoices, setInvoices] = useState(() =>
    JSON.parse(localStorage.getItem('milkstore_invoices') || '[]')
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const handleClearHistory = () => {
    if (window.confirm('Bạn chắc chắn muốn xóa toàn bộ lịch sử hóa đơn lưu trong trình duyệt?')) {
      localStorage.removeItem('milkstore_invoices')
      setInvoices([])
      setSelectedInvoice(null)
      toast.success('Đã xóa sạch lịch sử hóa đơn bán lẻ!')
    }
  }

  const filteredInvoices = invoices.filter((inv) =>
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0)
  const totalProfit = invoices.reduce((acc, inv) => acc + (Number(inv.grossProfit) || 0), 0)

  return (
    <section className="unit-page">
      <div className="unit-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="eyebrow">Quản lý hóa đơn</p>
          <h2>Lịch sử Đơn hàng Bán lẻ</h2>
          <p>Tra cứu chi tiết sản phẩm, doanh thu và lợi nhuận gộp theo từng hóa đơn.</p>
        </div>
        {invoices.length > 0 ? (
          <button
            type="button"
            onClick={handleClearHistory}
            style={{
              padding: '0.4rem 0.8rem',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🗑️ Xóa sạch lịch sử
          </button>
        ) : null}
      </div>

      <div className="unit-panel" style={{ marginBottom: '1.5rem', background: '#f8fafc', borderLeft: '4px solid #0d9488' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <small style={{ color: '#64748b', fontWeight: 'bold' }}>TỔNG DOANH THU ĐÃ XUẤT</small>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f766e' }}>
              {totalRevenue.toLocaleString('vi-VN')} đ
            </div>
          </div>
          <div>
            <small style={{ color: '#64748b', fontWeight: 'bold' }}>TỔNG LỢI NHUẬN Gộp (Ước tính)</small>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
              {totalProfit.toLocaleString('vi-VN')} đ
            </div>
          </div>
          <div>
            <small style={{ color: '#64748b', fontWeight: 'bold' }}>SỐ HÓA ĐƠN LƯU TRỮ</small>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {invoices.length} đơn
            </div>
          </div>
        </div>
      </div>

      <div className="unit-panel">
        <div className="nhom-chu-toolbar">
          <h3>Danh sách hóa đơn</h3>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Tìm theo mã hóa đơn (VD: HD123)..."
            style={{ padding: '0.4rem', borderRadius: '2px', border: '1px solid #ccc', minWidth: '250px' }}
          />
        </div>

        <div className="unit-table-wrap">
          <table className="unit-table">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Thời gian xuất</th>
                <th>Số mặt hàng</th>
                <th>Tổng thanh toán</th>
                <th>Tiền vốn</th>
                <th>Lợi nhuận gộp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Chưa có hóa đơn nào được lưu trữ.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ background: selectedInvoice?.id === inv.id ? '#f0fdfa' : 'transparent' }}>
                    <td><strong>{inv.id}</strong></td>
                    <td>{new Date(inv.createdAt).toLocaleString('vi-VN')}</td>
                    <td><strong>{inv.items?.length || 0}</strong> dòng</td>
                    <td><strong style={{ color: '#0d9488' }}>{(Number(inv.totalAmount) || 0).toLocaleString('vi-VN')} đ</strong></td>
                    <td>{(Number(inv.totalCost) || 0).toLocaleString('vi-VN')} đ</td>
                    <td><strong style={{ color: '#16a34a' }}>{(Number(inv.grossProfit) || 0).toLocaleString('vi-VN')} đ</strong></td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(selectedInvoice?.id === inv.id ? null : inv)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          background: selectedInvoice?.id === inv.id ? '#0d9488' : '#e2e8f0',
                          color: selectedInvoice?.id === inv.id ? '#fff' : '#333',
                          border: 'none',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        {selectedInvoice?.id === inv.id ? 'Thu gọn' : 'Xem chi tiết'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedInvoice ? (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <h4 style={{ color: '#0f766e', marginBottom: '0.8rem', borderBottom: '1px solid #eee', paddingBottom: '0.4rem' }}>
              📦 Chi tiết mặt hàng của hóa đơn {selectedInvoice.id}
            </h4>
            <table className="unit-table" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th>Mã hàng</th>
                  <th>Tên hàng</th>
                  <th>Quy cách bán</th>
                  <th>Số lượng</th>
                  <th>Đơn giá áp dụng</th>
                  <th>Thành tiền</th>
                  <th>Trừ kho thực tế</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.code}</strong></td>
                    <td>{item.name}</td>
                    <td><span style={{ color: '#0d9488', fontWeight: 'bold' }}>{item.unitLabel}</span></td>
                    <td><strong>{item.safeQuantity || item.quantity}</strong></td>
                    <td>{(Number(item.appliedPrice) || 0).toLocaleString('vi-VN')} đ</td>
                    <td><strong>{((Number(item.appliedPrice) || 0) * (Number(item.safeQuantity || item.quantity) || 0)).toLocaleString('vi-VN')} đ</strong></td>
                    <td><small style={{ color: '#666' }}>{item.totalBaseQtyDecreased} {item.dvt3 || item.unit}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default InvoicesPage


