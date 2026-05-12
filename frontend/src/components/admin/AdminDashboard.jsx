import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import NhomChuPage from '../../pages/nhom-chu/NhomChuPage'
import NhomHangPage from '../../pages/nhom-hang/NhomHangPage'
import UnitConversionPage from '../../pages/unit-conversions/UnitConversionPage'
import LanguageSwitcher from '../auth/LanguageSwitcher'

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
    ...t.admin.menuItems.slice(2),
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
  return (
    <>
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
          <div className="sales-toolbar">
            <div>
              <h2>{t.admin.quickActions[0]}</h2>
              <p>{t.admin.salesDescription}</p>
            </div>

            <div className="toolbar-actions">
              {t.admin.quickActions.slice(1, 4).map((action) => (
                <button key={action} type="button">
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="invoice-area" aria-label={t.admin.title}>
            <table>
              <thead>
                <tr>
                  {t.admin.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleProducts.map((product, index) => (
                  <tr key={product.code}>
                    <td>{index + 1}</td>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.unit}</td>
                    <td>{product.warehouse}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>{product.total}</td>
                    <td>{product.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="checkout-panel" aria-label={t.admin.payment}>
          <div className="checkout-header">
            <span>{t.admin.payment}</span>
            <strong>1.200.000</strong>
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
            <button type="button" className="secondary-admin-action">
              {t.admin.saveOrder}
            </button>
            <button type="button" className="secondary-admin-action">
              {t.admin.preview}
            </button>
            <button type="button" className="pay-action">
              {t.admin.payNow}
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
