import './PlaceholderPage.css'

function PlaceholderPage({ title }) {
  return (
    <section className="admin-placeholder">
      <p className="eyebrow">{title}</p>
      <h2>{title}</h2>
      <p>Trang này sẽ được bổ sung chức năng ở bước tiếp theo.</p>
    </section>
  )
}

export default PlaceholderPage
