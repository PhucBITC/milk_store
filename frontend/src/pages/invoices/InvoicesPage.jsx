import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import './InvoicesPage.css'
import logo from '../../assets/logo.svg'

function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeFilter, setActiveFilter] = useState('all') // 'today', 'month', 'year', 'all'
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoiceDetails, setInvoiceDetails] = useState([])
  const [isReportOpen, setIsReportOpen] = useState(false)

  // 1. Lấy danh sách hóa đơn từ Database
  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/hoadon')
      if (!response.ok) throw new Error('Không thể lấy danh sách hóa đơn')
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Các hàm lọc nhanh
  const setFilterToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today)
    setEndDate(today)
    setActiveFilter('today')
  }

  const setFilterThisMonth = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const today = now.toISOString().split('T')[0]
    setStartDate(firstDay)
    setEndDate(today)
    setActiveFilter('month')
  }

  const setFilterThisYear = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
    const today = now.toISOString().split('T')[0]
    setStartDate(firstDay)
    setEndDate(today)
    setActiveFilter('year')
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setActiveFilter('all')
  }

  const getFilterLabel = () => {
    if (activeFilter === 'today') return 'HÔM NAY'
    if (activeFilter === 'month') return `THÁNG ${new Date().getMonth() + 1}/${new Date().getFullYear()}`
    if (activeFilter === 'year') return `NĂM ${new Date().getFullYear()}`
    if (startDate && endDate) return `TỪ ${new Date(startDate).toLocaleDateString('vi-VN')} ĐẾN ${new Date(endDate).toLocaleDateString('vi-VN')}`
    return 'TẤT CẢ THỜI GIAN'
  }

  // 2. Lấy chi tiết một hóa đơn khi bấm "Xem chi tiết"
  const handleViewDetails = async (invoice) => {
    if (selectedInvoice?.maHoaDon === invoice.maHoaDon) {
      setSelectedInvoice(null)
      setInvoiceDetails([])
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/hoadon/${invoice.maHoaDon}/details`)
      if (!response.ok) throw new Error('Không thể lấy chi tiết hóa đơn')
      const details = await response.json()
      setSelectedInvoice(invoice)
      setInvoiceDetails(details)
    } catch (error) {
      toast.error('Lỗi: ' + error.message)
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inv.sdtKhachHang && inv.sdtKhachHang.includes(searchTerm))
    
    const invoiceDate = inv.ngayGioTao.split('T')[0] // Lấy phần yyyy-MM-dd
    const matchesStartDate = startDate ? invoiceDate >= startDate : true
    const matchesEndDate = endDate ? invoiceDate <= endDate : true

    return matchesSearch && matchesStartDate && matchesEndDate
  })

  const totalRevenue = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.soTienHoaDon) || 0), 0)

  return (
    <section className="unit-page">
      <div className="unit-page-header">
        <div>
          <p className="eyebrow">Hệ thống quản lý sữa</p>
          <h2>Lịch sử Hóa đơn Bán hàng</h2>
          <p>Quản lý toàn bộ giao dịch, doanh thu và trạng thái thuế VAT của cửa hàng.</p>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="unit-panel" style={{ marginBottom: '1.5rem', background: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div>
            <small style={{ color: '#64748b', fontWeight: 'bold' }}>TỔNG DOANH THU (DB)</small>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#166534' }}>
              {totalRevenue.toLocaleString('vi-VN')} đ
            </div>
          </div>
          <div>
            <small style={{ color: '#64748b', fontWeight: 'bold' }}>SỐ LƯỢNG GIAO DỊCH</small>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
              {invoices.length} hóa đơn
            </div>
          </div>
        </div>
      </div>

      <div className="unit-panel">
        <div className="nhom-chu-toolbar" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <h3>Danh sách hóa đơn mới nhất</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm mã hóa đơn hoặc số điện thoại..."
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', minWidth: '300px' }}
              />
              <button onClick={fetchInvoices} className="btn-refresh" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Làm mới</button>
            </div>
          </div>

          <div className="filter-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>Từ ngày:</span>
              <input type="date" lang="vi-VN" value={startDate} onChange={(e) => { setStartDate(e.target.value); setActiveFilter('none'); }} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>Đến ngày:</span>
              <input type="date" lang="vi-VN" value={endDate} onChange={(e) => { setEndDate(e.target.value); setActiveFilter('none'); }} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
              <button className={`btn-quick-filter ${activeFilter === 'today' ? 'active' : ''}`} onClick={setFilterToday}>Hôm nay</button>
              <button className={`btn-quick-filter ${activeFilter === 'month' ? 'active' : ''}`} onClick={setFilterThisMonth}>Tháng này</button>
              <button className={`btn-quick-filter ${activeFilter === 'year' ? 'active' : ''}`} onClick={setFilterThisYear}>Năm nay</button>
              <button className="btn-quick-filter" onClick={clearFilters} style={{ background: '#e2e8f0', color: '#475569' }}>Xóa lọc</button>
            </div>
            <button 
              className="btn-export-report" 
              onClick={() => setIsReportOpen(true)}
              style={{ marginLeft: 'auto', padding: '0.6rem 1.2rem', background: 'var(--success-action)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Xuất báo cáo thống kê
            </button>
          </div>
        </div>

        <div className="unit-table-wrap">
          <table className="unit-table">
            <thead>
              <tr>
                <th>Mã Hóa Đơn</th>
                <th>Thời Gian</th>
                <th>Chi Nhánh</th>
                <th>Khách Hàng</th>
                <th>Thanh Toán</th>
                <th>VAT</th>
                <th>Tổng Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu từ Database...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Không tìm thấy hóa đơn nào.</td></tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.maHoaDon} style={{ background: selectedInvoice?.maHoaDon === inv.maHoaDon ? '#f8fafc' : 'transparent' }}>
                    <td><strong style={{ color: '#0369a1' }}>{inv.maHoaDon}</strong></td>
                    <td>{new Date(inv.ngayGioTao).toLocaleString('vi-VN')}</td>
                    <td><span className="badge-branch">{inv.maChiNhanh}</span></td>
                    <td>
                      <div>{inv.sdtKhachHang || 'Khách lẻ'}</div>
                      <small style={{ color: '#64748b' }}>{inv.nhanVienBan}</small>
                    </td>
                    <td>
                      <span className={`badge-payment ${inv.hinhThucThanhToan === 'CK' ? 'ck' : 'tm'}`}>
                        {inv.hinhThucThanhToan === 'CK' ? 'Chuyển khoản' : 'Tiền mặt'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-vat ${inv.xuatVat === 'DA_XUAT_VAT' ? 'active' : ''}`}>
                        {inv.xuatVat === 'DA_XUAT_VAT' ? 'Đã xuất' : 'Chưa xuất'}
                      </span>
                    </td>
                    <td><strong style={{ color: '#16a34a' }}>{(Number(inv.soTienHoaDon) || 0).toLocaleString('vi-VN')} đ</strong></td>
                    <td>
                      <button
                        className="btn-view-detail"
                        onClick={() => handleViewDetails(inv)}
                      >
                        {selectedInvoice?.maHoaDon === inv.maHoaDon ? 'Thu gọn' : 'Chi tiết'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL HÓA ĐƠN ĐIỆN TỬ (Phong cách doanh nghiệp hiện đại) */}
        {selectedInvoice && (
          <div className="invoice-modal-overlay" onClick={() => { setSelectedInvoice(null); setInvoiceDetails([]); }}>
            <div className="invoice-document" onClick={(e) => e.stopPropagation()}>
              
              {/* Header của tờ hóa đơn */}
              <div className="doc-header">
                <div className="store-brand">
                  <div className="logo-placeholder" style={{ background: 'transparent' }}>
                    <img src={logo} alt="Logo Mẹ Xíu" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h2>MẸ XÍU</h2>
                  </div>
                </div>
                <div className="invoice-meta">
                  <h1>HÓA ĐƠN</h1>
                  <p>Số: <strong>{selectedInvoice.maHoaDon}</strong></p>
                  <p>Ngày: {new Date(selectedInvoice.ngayGioTao).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="doc-divider"></div>

              {/* Thông tin 2 bên */}
              <div className="doc-info-grid">
                <div className="info-block">
                  <span className="label">ĐƠN VỊ BÁN HÀNG</span>
                  <p><strong>Chi nhánh:</strong> {selectedInvoice.maChiNhanh}</p>
                  <p><strong>Nhân viên:</strong> {selectedInvoice.nhanVienBan}</p>
                  <p><strong>Hình thức:</strong> {selectedInvoice.hinhThucThanhToan === 'CK' ? 'Chuyển khoản' : 'Tiền mặt'}</p>
                </div>
                <div className="info-block">
                  <span className="label">KHÁCH HÀNG</span>
                  <p><strong>SĐT:</strong> {selectedInvoice.sdtKhachHang || 'Khách vãng lai'}</p>
                  <p><strong>Trạng thái thuế:</strong> {selectedInvoice.xuatVat === 'DA_XUAT_VAT' ? 'Đã xuất VAT (10%)' : 'Chưa xuất VAT'}</p>
                </div>
              </div>

              {/* Bảng danh sách sản phẩm */}
              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã hàng</th>
                      <th>Số lượng</th>
                      <th>ĐVT</th>
                      <th className="text-right">Đơn giá</th>
                      <th className="text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td><strong>{item.maHang}</strong></td>
                        <td>{item.soLuong}</td>
                        <td>{item.dvt}</td>
                        <td className="text-right">{item.donGia.toLocaleString('vi-VN')} đ</td>
                        <td className="text-right"><strong>{item.thanhTien.toLocaleString('vi-VN')} đ</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tổng kết tiền */}
              <div className="doc-summary">
                <div className="stamp-container">
                  <div className="paid-stamp">ĐÃ THANH TOÁN</div>
                </div>
                <div className="summary-details">
                  <div className="sum-row">
                    <span>Tổng tiền hàng:</span>
                    <span>{selectedInvoice.soTienHoaDon.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="sum-row main-total">
                    <span>TỔNG CỘNG:</span>
                    <span>{selectedInvoice.soTienHoaDon.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <p className="amount-words"><i>Bằng chữ: (Ba trăm năm mươi ngàn đồng chẵn)</i></p>
                </div>
              </div>

              <div className="doc-footer">
                <button className="btn-print-doc" onClick={() => window.print()}>In hóa đơn</button>
                <button className="btn-close-doc" onClick={() => { setSelectedInvoice(null); setInvoiceDetails([]); }}>Đóng lại</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL BÁO CÁO THỐNG KÊ TỔNG HỢP */}
        {isReportOpen && (
          <div className="invoice-modal-overlay" onClick={() => setIsReportOpen(false)}>
            <div className="report-document" onClick={(e) => e.stopPropagation()}>
              <div className="doc-header">
                <div className="store-brand">
                  <img src={logo} alt="Logo Mẹ Xíu" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ fontSize: '1.2rem' }}>MẸ XÍU</h2>
                    <p style={{ fontSize: '0.7rem' }}>BÁO CÁO DOANH THU NỘI BỘ</p>
                  </div>
                </div>
                <div className="invoice-meta" style={{ textAlign: 'right' }}>
                  <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>BÁO CÁO THỐNG KÊ</h1>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0369a1' }}>KỲ BÁO CÁO: {getFilterLabel()}</p>
                </div>
              </div>

              <div className="doc-divider"></div>

              {/* Thống kê thẻ số */}
              <div className="report-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <div className="report-card">
                  <small>TỔNG DOANH THU</small>
                  <div className="val">{totalRevenue.toLocaleString('vi-VN')} đ</div>
                </div>
                <div className="report-card">
                  <small>SỐ LƯỢNG ĐƠN HÀNG</small>
                  <div className="val">{filteredInvoices.length} đơn</div>
                </div>
                <div className="report-card">
                  <small>TB MỖI ĐƠN HÀNG</small>
                  <div className="val">
                    {filteredInvoices.length > 0 
                      ? Math.round(totalRevenue / filteredInvoices.length).toLocaleString('vi-VN')
                      : 0} đ
                  </div>
                </div>
              </div>

              {/* Bảng chi tiết đơn hàng trong báo cáo */}
              <div className="doc-table-wrap">
                <table className="doc-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã HĐ</th>
                      <th>Thời gian</th>
                      <th>Khách hàng</th>
                      <th>HTTT</th>
                      <th className="text-right">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv, index) => (
                      <tr key={inv.maHoaDon}>
                        <td>{index + 1}</td>
                        <td><strong>{inv.maHoaDon}</strong></td>
                        <td>{new Date(inv.ngayGioTao).toLocaleString('vi-VN')}</td>
                        <td>{inv.sdtKhachHang || 'Khách lẻ'}</td>
                        <td>{inv.hinhThucThanhToan}</td>
                        <td className="text-right"><strong>{inv.soTienHoaDon.toLocaleString('vi-VN')} đ</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="report-signature" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', padding: '0 40px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p><strong>Người lập biểu</strong></p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>(Ký và ghi rõ họ tên)</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p>Ngày ...... tháng ...... năm 20...</p>
                  <p><strong>Xác nhận của quản lý</strong></p>
                </div>
              </div>

              <div className="doc-footer no-print">
                <button className="btn-print-doc" onClick={() => window.print()}>In báo cáo</button>
                <button className="btn-close-doc" onClick={() => setIsReportOpen(false)}>Đóng lại</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .badge-payment { padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
        .badge-payment.tm { background: #dcfce7; color: #166534; }
        .badge-payment.ck { background: #e0f2fe; color: var(--success-action); }
        .badge-vat { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #cbd5e1; color: #64748b; }
        .badge-vat.active { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
        .btn-view-detail { padding: 4px 12px; background: var(--success-action) !important; color: white !important; border: none !important; border-radius: 4px; cursor: pointer; font-weight: bold; }

        /* CSS CHO MODAL HÓA ĐƠN CHUYÊN NGHIỆP */
        .invoice-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 20px; }
        .invoice-document { background: white; width: 100%; max-width: 800px; padding: 40px; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; max-height: 95vh; overflow-y: auto; }
        
        .doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .store-brand { display: flex; gap: 15px; align-items: center; }
        .logo-placeholder { width: 50px; height: 50px; background: var(--success-action) !important; color: white !important; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 1.5rem; }
        .store-brand h2 { margin: 0; color: var(--success-action) !important; font-size: 1.5rem; }
        .store-brand p { margin: 0; color: #64748b; font-size: 0.85rem; }
        
        .invoice-meta { text-align: right; }
        .invoice-meta h1 { margin: 0; color: #1e293b; font-size: 2rem; letter-spacing: 2px; }
        .invoice-meta p { margin: 5px 0 0; color: #64748b; }
        
        .doc-divider { height: 2px; background: var(--success-action) !important; margin: 20px 0; }
        
        .doc-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
        .label { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .info-block p { margin: 4px 0; color: #334155; font-size: 0.9rem; }
        
        .doc-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .doc-table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.85rem; }
        .doc-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 0.9rem; }
        .text-right { text-align: right !important; }
        
        .doc-summary { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
        .paid-stamp { border: 4px solid #16a34a; color: #16a34a; padding: 10px 20px; font-size: 1.5rem; font-weight: 900; border-radius: 8px; transform: rotate(-15deg); opacity: 0.6; }
        .summary-details { width: 100%; max-width: 300px; }
        .sum-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569; }
        .main-total { border-top: 2px solid var(--success-action) !important; padding-top: 8px; font-size: 1.2rem; font-weight: 800; color: #16a34a; }
        .amount-words { font-size: 0.8rem; color: #64748b; margin-top: 10px; text-align: right; }
        
        .doc-footer { margin-top: 40px; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px dashed #cbd5e1; padding-top: 20px; }
        .btn-print-doc { padding: 10px 20px; background: var(--success-action) !important; color: white !important; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-close-doc { padding: 10px 20px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; }

        .btn-quick-filter { padding: 0.4rem 0.8rem; background: #fff; border: 1px solid var(--success-action) !important; color: var(--success-action) !important; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: bold; transition: 0.2s; }
        .btn-quick-filter:hover, .btn-quick-filter.active { background: var(--success-action) !important; color: white !important; }
        .btn-refresh { background: var(--success-action) !important; color: white !important; border: none !important; border-radius: 4px; font-weight: bold; }

        .report-document { background: white; width: 100%; max-width: 900px; padding: 50px; border-radius: 4px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; max-height: 95vh; overflow-y: auto; }
        .report-card { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
        .report-card small { font-size: 0.65rem; font-weight: 800; color: #64748b; display: block; margin-bottom: 5px; }
        .report-card .val { font-size: 1.25rem; font-weight: 900; color: var(--success-action) !important; }

        /* TỐI ƯU HÓA IN ẤN (HỖ TRỢ CẢ HÓA ĐƠN VÀ BÁO CÁO) */
        @media print {
          @page { margin: 10mm; size: auto; }
          body { margin: 0; }
          body * { visibility: hidden; }
          .invoice-modal-overlay, .invoice-modal-overlay *, .report-document, .report-document * { visibility: visible; }
          .invoice-modal-overlay { position: fixed; left: 0; top: 0; background: white; padding: 0; margin: 0; width: 100%; height: 100%; display: flex !important; justify-content: center; }
          .invoice-document, .report-document { box-shadow: none; border: none; width: 100%; max-width: 100%; margin: 0; padding: 0; }
          .doc-footer, .btn-close, .no-print { display: none !important; }
        }
      `}} />
    </section>
  )
}

export default InvoicesPage
