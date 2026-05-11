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

function AdminDashboard({ accountEmail, t, onLogout }) {
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
          {t.admin.menuItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className={index === 2 ? 'active' : ''}
            >
              <span>{item.slice(0, 1)}</span>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">{t.admin.title}</p>
            <h1>Bảng điều khiển bán hàng</h1>
          </div>

          <div className="admin-user">
            <span>{accountEmail}</span>
            <button type="button" onClick={onLogout}>
              {t.admin.logout}
            </button>
          </div>
        </header>

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
                <p>Quản lý sản phẩm, số lượng và giá bán trong hóa đơn.</p>
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
      </section>
    </main>
  )
}

export default AdminDashboard
