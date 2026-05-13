import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import NhomChuPage from '../../pages/nhom-chu/NhomChuPage'
import NhomHangPage from '../../pages/nhom-hang/NhomHangPage'
import HangHoaPage from '../../pages/hang-hoa/HangHoaPage'
import UnitConversionPage from '../../pages/unit-conversions/UnitConversionPage'
import KhachHangPage from '../../pages/khach-hang/KhachHangPage'
import NhaCungCapPage from '../../pages/nha-cung-cap/NhaCungCapPage'
import SalesDashboard from '../../pages/sales/SalesDashboard'
import InvoicesPage from '../../pages/invoices/InvoicesPage'
import PlaceholderPage from '../../pages/placeholder/PlaceholderPage'
import BrandLogo from '../shared/BrandLogo'
import AdminTopbar from './layout/AdminTopbar'
import AdminIcon from './shared/AdminIcon'
import { fallbackPageTitles, menuIconTypes, menuRoutes } from '../../config/adminNavigation'
import './AdminDashboard.css'

function AdminDashboard({
  accountEmail,
  language,
  t,
  theme,
  onLanguageChange,
  onLogout,
  onThemeToggle,
}) {
  const location = useLocation()
  const translatedPageTitles = {
    '/setting': t.admin.pageTitles.settings,
    '/donvi': t.admin.pageTitles.units,
    '/khach-hang': t.khachHang?.pageTitle || 'Quản lý khách hàng',
    '/nha-cung-cap': t.nhaCungCap?.pageTitle || 'Quản lý nhà cung cấp',
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
  const currentTitle = translatedPageTitles[location.pathname] || fallbackPageTitles[location.pathname] || translatedPageTitles['/products']
  const adminMenuItems = [
    t.admin.menuItems[0],
    t.admin.menuItems[1],
    t.khachHang?.menuTitle || 'Khách hàng',
    t.nhaCungCap?.menuTitle || 'Nhà cung cấp',
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
          <BrandLogo />
          <div>
            <strong>{t.brandName}</strong>
            <small>{t.admin.title}</small>
          </div>
        </div>

        <nav className="admin-nav">
          {adminMenuItems.map((item, index) => (
            <NavLink key={item} to={menuRoutes[index]}>
              <AdminIcon type={menuIconTypes[index]} />
              {item}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-workspace">
        <AdminTopbar
          accountEmail={accountEmail}
          currentTitle={currentTitle}
          language={language}
          t={t}
          theme={theme}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
          onThemeToggle={onThemeToggle}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/setting" element={<PlaceholderPage title="Cài đặt" />} />
          <Route path="/donvi" element={<UnitConversionPage t={t.unitConversion} />} />
          <Route path="/khach-hang" element={<KhachHangPage t={t.khachHang} />} />
          <Route path="/nha-cung-cap" element={<NhaCungCapPage t={t.nhaCungCap} />} />
          <Route path="/nhom-chu" element={<NhomChuPage t={t.nhomChu} />} />
          <Route path="/nhom-hang" element={<NhomHangPage t={t.nhomHang} />} />
          <Route path="/hang-hoa" element={<HangHoaPage t={t.hangHoa} />} />
          <Route path="/products" element={<SalesDashboard t={t} />} />
          <Route path="/inventory" element={<PlaceholderPage title="Kho hàng" />} />
          <Route path="/invoices" element={<InvoicesPage />} />
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

export default AdminDashboard

