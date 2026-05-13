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
    customer: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    supplier: (
      <>
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
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

export default AdminIcon
