import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import NhomChuPage from '../../pages/nhom-chu/NhomChuPage'
import NhomHangPage from '../../pages/nhom-hang/NhomHangPage'
import HangHoaPage from '../../pages/hang-hoa/HangHoaPage'
import UnitConversionPage from '../../pages/unit-conversions/UnitConversionPage'
import LanguageSwitcher from '../auth/LanguageSwitcher'
import { getHangHoaList } from '../../services/hangHoaService'

const sampleProducts = [
  {
    code: 'SUA-001',
    name: 'Sữa tươi tiệt trùng ME XIU 1L',
    unit: 'Thùng',
    warehouse: 'Kho A',
    quantity: 2,
    price: '360.000',
    total: '720.000',
    note: 'HSD 12/2026',
  },
  {
    code: 'SUA-014',
    name: 'Sữa chua uống dâu 180ml',
    unit: 'Khay',
    warehouse: 'Kho B',
    quantity: 5,
    price: '96.000',
    total: '480.000',
    note: 'Giao lạnh',
  },
]

const adminStats = [
  { value: '18', label: 'Đơn chờ xử lý' },
  { value: '1.2k', label: 'Sản phẩm khả dụng' },
  { value: '32', label: 'Đại lý hôm nay' },
]

const menuIconTypes = [
  'settings',
  'unit',
  'product',
  'product',
  'product',
  'invoice',
  'warehouse',
  'invoice',
  'debt',
  'cash',
  'report',
  'help',
]

const menuRoutes = [
  '/setting',
  '/donvi',
  '/nhom-chu',
  '/nhom-hang',
  '/hang-hoa',
  '/products',
  '/inventory',
  '/invoices',
  '/debts',
  '/cash',
  '/reports',
  '/help',
]

const pageTitles = {
  '/setting': 'Cài đặt',
  '/donvi': 'Quản lý đơn vị tính',
  '/hang-hoa': 'Quản lý hàng hóa',
  '/products': 'Bảng điều khiển bán hàng',
  '/inventory': 'Quản lý kho hàng',
  '/invoices': 'Quản lý hóa đơn',
  '/debts': 'Quản lý công nợ',
  '/cash': 'Quản lý thu chi',
  '/reports': 'Báo cáo',
  '/help': 'Hướng dẫn',
}

function AdminDashboard({
  accountEmail,
  language,
  t,
  onLanguageChange,
  onLogout,
}) {
  const location = useLocation()
  const translatedPageTitles = {
    '/setting': t.admin.pageTitles.settings,
    '/donvi': t.admin.pageTitles.units,
    '/nhom-chu': t.nhomChu.pageTitle,
    '/nhom-hang': t.nhomHang.pageTitle,
    '/hang-hoa': t.hangHoa?.pageTitle || 'Quản lý hàng hóa',
    '/products': t.admin.pageTitles.products,
    '/inventory': t.admin.pageTitles.inventory,
    '/invoices': t.admin.pageTitles.invoices,
    '/debts': t.admin.pageTitles.debts,
    '/cash': t.admin.pageTitles.cash,
    '/reports': t.admin.pageTitles.reports,
    '/help': t.admin.pageTitles.help,
  }
  const currentTitle = translatedPageTitles[location.pathname] || pageTitles[location.pathname] || translatedPageTitles['/products']
  const adminMenuItems = [
    t.admin.menuItems[0],
    t.admin.menuItems[1],
    t.nhomChu.menuTitle,
    t.nhomHang.menuTitle,
    t.hangHoa?.menuTitle || 'Hàng hóa',
    t.admin.quickActions?.[0] || 'BÁN HÀNG',
    ...t.admin.menuItems.slice(3),
  ]

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-brand">
          <span className="brand-mark">M</span>
          <div>
            <strong>{t.brandName}</strong>
            <small>{t.admin.title}</small>
          </div>
        </div>

        <nav className="admin-nav">
          {adminMenuItems.map((item, index) => (
            <NavLink
              key={item}
              to={menuRoutes[index]}
            >
              <AdminIcon type={menuIconTypes[index]} />
              {item}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">{t.admin.title}</p>
            <h1>{currentTitle}</h1>
          </div>

          <div className="admin-user">
            <LanguageSwitcher
              currentLanguage={language}
              label={t.languageLabel}
              onChange={onLanguageChange}
            />
            <span>{accountEmail}</span>
            <button type="button" onClick={onLogout}>
              {t.admin.logout}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/setting" element={<PlaceholderPage title="Cài đặt" />} />
          <Route path="/donvi" element={<UnitConversionPage t={t.unitConversion} />} />
          <Route path="/nhom-chu" element={<NhomChuPage t={t.nhomChu} />} />
          <Route path="/nhom-hang" element={<NhomHangPage t={t.nhomHang} />} />
          <Route path="/hang-hoa" element={<HangHoaPage t={t.hangHoa} />} />
          <Route path="/products" element={<SalesDashboard t={t} />} />
          <Route path="/inventory" element={<PlaceholderPage title="Kho hàng" />} />
          <Route path="/invoices" element={<PlaceholderPage title="Hóa đơn" />} />
          <Route path="/debts" element={<PlaceholderPage title="Công nợ" />} />
          <Route path="/cash" element={<PlaceholderPage title="Thu chi" />} />
          <Route path="/reports" element={<PlaceholderPage title="Báo cáo" />} />
          <Route path="/help" element={<PlaceholderPage title="Hướng dẫn" />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </section>
    </main>
  )
}

function SalesDashboard({ t }) {
  const [dbProducts, setDbProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')

  // Tải danh sách Hàng hóa thực tế từ DB kèm theo cấu trúc giá 3 tầng
  useEffect(() => {
    let isMounted = true
    getHangHoaList()
      .then((res) => {
        if (isMounted) {
          setDbProducts(res.data)
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  // Gợi ý danh sách sản phẩm từ DB kèm theo cả 3 mức giá sỉ/lẻ
  const availableOptions = dbProducts.length > 0
    ? dbProducts.map((p) => ({
        code: p.maHang,
        name: p.tenHang,
        dvt1: p.dvt1,
        dvt2: p.dvt2,
        dvt3: p.dvt3 || p.dvt,
        giaBan1: Number(p.giaBan1) || 0,
        giaBan2: Number(p.giaBan2) || 0,
        giaBan3: Number(p.giaBan3 || p.giaBan) || 0,
        qc1: p.qc1 || 1,
        qc2: p.qc2 || 1,
        warehouse: 'Kho Tổng',
      }))
    : sampleProducts.map((p) => ({
        ...p,
        dvt3: p.unit,
        giaBan3: Number(p.price.replace(/\./g, '')) || 0,
      }))

  const handleAddProduct = (code) => {
    if (!code) return
    const found = availableOptions.find((item) => item.code === code)
    if (!found) return

    setCartItems((current) => {
      // Cách chuẩn xác nhất của máy POS siêu thị:
      // Tìm xem mặt hàng này đã xuất hiện trong giỏ hàng ở BẤT KỲ dòng nào chưa.
      // Nếu ĐÃ CÓ ít nhất 1 dòng của mặt hàng này, ta luôn ưu tiên CỘNG DỒN SỐ LƯỢNG vào dòng đầu tiên tìm thấy.
      const existingRowIndex = current.findIndex((item) => item.code === code)

      if (existingRowIndex > -1) {
        const updated = [...current]
        updated[existingRowIndex] = {
          ...updated[existingRowIndex],
          quantity: updated[existingRowIndex].quantity + 1,
        }
        return updated
      }

      // Nếu CHƯA CÓ dòng nào của mặt hàng này, tạo mới với quy cách lớn nhất khả dụng
      const initialTier = found.dvt1 && found.giaBan1 > 0
        ? 'DVT1'
        : found.dvt2 && found.giaBan2 > 0
        ? 'DVT2'
        : 'DVT3'

      // Sử dụng Date.now() làm cartRowId để đảm bảo mỗi dòng tách ra vĩnh viễn mang key duy nhất
      const uniqueId = `${code}-${Date.now()}`
      return [...current, { ...found, cartRowId: uniqueId, selectedTier: initialTier, quantity: 1 }]
    })
    setSelectedProduct('')
    setCheckoutMessage('')
  }

  // Chức năng "Tách dòng" (Split row) cực kỳ đột phá:
  // Cho phép nhân viên bấm nút tách dòng để chèn thêm 1 dòng độc lập cho chính mặt hàng đó nhằm bán quy cách khác
  const handleSplitRow = (itemToSplit) => {
    setCartItems((current) => {
      const index = current.findIndex((item) => item.cartRowId === itemToSplit.cartRowId)
      if (index === -1) return current

      const updated = [...current]
      // Chèn thêm 1 dòng ngay bên dưới dòng hiện tại, mặc định số lượng = 1 và ở quy cách cơ sở (DVT3)
      const newRowUniqueId = `${itemToSplit.code}-${Date.now()}`
      const newRow = {
        ...itemToSplit,
        cartRowId: newRowUniqueId,
        selectedTier: 'DVT3',
        quantity: 1,
      }

      updated.splice(index + 1, 0, newRow)
      return updated
    })
  }

  const handleUpdateQty = (cartRowId, delta) => {
    setCartItems((current) => {
      return current
        .map((item) => {
          if (item.cartRowId === cartRowId) {
            return { ...item, quantity: item.quantity + delta }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const handleSwitchTier = (cartRowId, newTier) => {
    setCartItems((current) => {
      return current.map((item) => {
        if (item.cartRowId === cartRowId) {
          return { ...item, selectedTier: newTier }
        }
        return item
      })
    })
  }

  // Tính toán đơn giá áp dụng và số lượng trừ kho cơ sở cho từng dòng
  const getLineDetails = (item) => {
    const unitLabel = item.selectedTier === 'DVT1'
      ? item.dvt1
      : item.selectedTier === 'DVT2'
      ? item.dvt2
      : item.dvt3

    const appliedPrice = item.selectedTier === 'DVT1'
      ? item.giaBan1
      : item.selectedTier === 'DVT2'
      ? item.giaBan2
      : item.giaBan3

    const baseQtyMultiplier = item.selectedTier === 'DVT1'
      ? item.qc1 * item.qc2
      : item.selectedTier === 'DVT2'
      ? item.qc2
      : 1

    const totalBaseQtyDecreased = item.quantity * baseQtyMultiplier

    return { unitLabel, appliedPrice, totalBaseQtyDecreased, baseUnitName: item.dvt3 }
  }

  const totalPrice = cartItems.reduce((acc, item) => {
    const { appliedPrice } = getLineDetails(item)
    return acc + appliedPrice * item.quantity
  }, 0)

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    setCheckoutMessage(
      `Thanh toán thành công đơn hàng đa quy cách trị giá ${totalPrice.toLocaleString('vi-VN')} đ!`
    )
    setCartItems([])
  }

  return (
    <>
      {checkoutMessage ? (
        <div
          style={{
            padding: '1rem',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontWeight: 'bold',
          }}
        >
          🎉 {checkoutMessage}
        </div>
      ) : null}

      <section className="admin-stats" aria-label="Dashboard stats">
        {adminStats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="sales-layout">
        <div className="sales-main">
          <div
            className="sales-toolbar"
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <div>
              <h2>{t.admin.quickActions[0]}</h2>
              <p>{t.admin.salesDescription}</p>
            </div>

            {/* Thanh chọn sản phẩm để bán */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <select
                value={selectedProduct}
                onChange={(e) => handleAddProduct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                <option value="">🔍 Chọn sản phẩm thêm vào hóa đơn...</option>
                {availableOptions.map((opt) => {
                  const defaultLabel = opt.dvt1 && opt.giaBan1 > 0
                    ? `${opt.dvt1}: ${opt.giaBan1.toLocaleString()} đ`
                    : `${opt.dvt3}: ${opt.giaBan3.toLocaleString()} đ`
                  return (
                    <option key={opt.code} value={opt.code}>
                      [{opt.code}] {opt.name} - ({defaultLabel})
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="invoice-area" aria-label={t.admin.title}>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã hàng</th>
                  <th>Tên hàng</th>
                  <th>Quy cách bán (ĐVT)</th>
                  <th>Số lượng</th>
                  <th>Đơn giá áp dụng</th>
                  <th>Thành tiền</th>
                  <th>Ý nghĩa trừ kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                      {t.admin.emptyText || 'Hóa đơn chưa có sản phẩm. Vui lòng chọn sản phẩm ở trên.'}
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item, index) => {
                    const { appliedPrice, totalBaseQtyDecreased, baseUnitName } = getLineDetails(item)
                    return (
                      <tr key={item.cartRowId}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{item.code}</strong>
                        </td>
                        <td>{item.name}</td>
                        <td>
                          {/* Chuyển đổi linh hoạt quy cách đóng gói trực tiếp trên dòng giỏ hàng */}
                          <select
                            value={item.selectedTier}
                            onChange={(e) => handleSwitchTier(item.cartRowId, e.target.value)}
                            style={{
                              padding: '0.2rem',
                              borderRadius: '2px',
                              fontWeight: 'bold',
                              border: '1px solid #0d9488',
                              background: '#f0fdfa',
                              color: '#0f766e',
                            }}
                          >
                            {item.dvt1 ? (
                              <option value="DVT1">
                                {item.dvt1} (Giá: {item.giaBan1?.toLocaleString()} đ)
                              </option>
                            ) : null}
                            {item.dvt2 ? (
                              <option value="DVT2">
                                {item.dvt2} (Giá: {item.giaBan2?.toLocaleString()} đ)
                              </option>
                            ) : null}
                            <option value="DVT3">
                              {item.dvt3} (Giá: {item.giaBan3?.toLocaleString()} đ)
                            </option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.cartRowId, -1)}
                              style={{
                                padding: '0.2rem 0.5rem',
                                cursor: 'pointer',
                                background: '#eee',
                                border: '1px solid #ccc',
                                borderRadius: '2px',
                              }}
                            >
                              -
                            </button>
                            <strong>{item.quantity}</strong>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.cartRowId, 1)}
                              style={{
                                padding: '0.2rem 0.5rem',
                                cursor: 'pointer',
                                background: '#eee',
                                border: '1px solid #ccc',
                                borderRadius: '2px',
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{appliedPrice.toLocaleString('vi-VN')}</td>
                        <td>
                          <strong style={{ color: '#0d9488' }}>
                            {(appliedPrice * item.quantity).toLocaleString('vi-VN')}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: '#666' }}>
                            Ngầm trừ: <strong>{totalBaseQtyDecreased}</strong> {baseUnitName}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {/* Nút tách dòng để bán nhiều quy cách đóng gói cho cùng mặt hàng */}
                            {item.dvt1 || item.dvt2 ? (
                              <button
                                type="button"
                                onClick={() => handleSplitRow(item)}
                                style={{
                                  color: '#0284c7',
                                  background: '#e0f2fe',
                                  border: '1px solid #bae6fd',
                                  borderRadius: '2px',
                                  padding: '0.1rem 0.3rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: 'bold',
                                }}
                                title="Chèn thêm dòng quy cách khác cho mặt hàng này"
                              >
                                + Tách dòng
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.cartRowId, -item.quantity)}
                              style={{
                                color: 'red',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="checkout-panel" aria-label={t.admin.payment}>
          <div className="checkout-header">
            <span>{t.admin.payment}</span>
            <strong>{totalPrice.toLocaleString('vi-VN')} đ</strong>
          </div>

          <label className="admin-checkbox">
            <input type="checkbox" />
            {t.admin.noPrint}
          </label>

          <div className="discount-grid">
            <label>
              {t.admin.discount}
              <input value="0" readOnly />
            </label>
            <label>
              {t.admin.percentDiscount}
              <input value="0%" readOnly />
            </label>
          </div>

          <p className="amount-text">{t.admin.amountInWords}</p>

          <div className="payment-actions">
            <button type="button" className="secondary-admin-action" onClick={() => setCartItems([])}>
              {t.admin.deleteBill || 'Xóa đơn'}
            </button>
            <button
              type="button"
              className="pay-action"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              style={{
                opacity: cartItems.length === 0 ? 0.5 : 1,
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {t.admin.payNow || 'F12 Thanh toán'}
            </button>
          </div>
        </aside>
      </section>
    </>
  )
}

function PlaceholderPage({ title }) {
  return (
    <section className="admin-placeholder">
      <p className="eyebrow">{title}</p>
      <h2>{title}</h2>
      <p>Trang này sẽ được bổ sung chức năng ở bước tiếp theo.</p>
    </section>
  )
}

function AdminIcon({ type }) {
  const paths = {
    settings: (
      <>
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
        <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6A7.6 7.6 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5a7.8 7.8 0 0 0 0 3l-2 1.5 2 3.4 2.4-1a7.6 7.6 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5Z" />
      </>
    ),
    unit: (
      <>
        <path d="M4 19h16" />
        <path d="M6 19V5h12v14" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
      </>
    ),
    product: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4.5 8 7.5 4.2L19.5 8" />
        <path d="M12 12.2V21" />
      </>
    ),
    warehouse: (
      <>
        <path d="M3 10 12 4l9 6" />
        <path d="M5 10v10h14V10" />
        <path d="M8 20v-6h8v6" />
        <path d="M9 10h6" />
      </>
    ),
    invoice: (
      <>
        <path d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1V3Z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </>
    ),
    debt: (
      <>
        <path d="M4 7h16v12H4z" />
        <path d="M4 10h16" />
        <path d="M8 15h3" />
        <path d="M15 15h1" />
      </>
    ),
    cash: (
      <>
        <path d="M7 7h13v10H7z" />
        <path d="M4 10v10h13" />
        <path d="M13.5 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
    report: (
      <>
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-7" />
      </>
    ),
    help: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-.9.7-1.7 1.2-1.7 2.5" />
        <path d="M12 17h.01" />
      </>
    ),
  }

  return (
    <span className="admin-nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        {paths[type]}
      </svg>
    </span>
  )
}

export default AdminDashboard
