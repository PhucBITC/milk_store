import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '../../auth/LanguageSwitcher'
import './AdminTopbar.css'

function AdminTopbar({
  accountEmail,
  currentTitle,
  language,
  t,
  onLanguageChange,
  onLogout,
}) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)
  const displayName = accountEmail || 'Admin'

  useEffect(() => {
    if (!isAccountMenuOpen) return undefined

    const handlePointerDown = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isAccountMenuOpen])

  return (
    <header className="admin-topbar">
      <div className="topbar-title">
        <h1>{currentTitle}</h1>
      </div>

      <label className="topbar-search">
        <SearchIcon />
        <input type="search" placeholder="Tìm kiếm..." />
      </label>

      <div className="topbar-actions">
        <button type="button" className="topbar-icon-button" aria-label="Đổi chế độ hiển thị">
          <MoonIcon />
        </button>

        <button type="button" className="topbar-icon-button has-badge" aria-label="Thông báo">
          <BellIcon />
          <span>9</span>
        </button>

        <LanguageSwitcher
          currentLanguage={language}
          label={t.languageLabel}
          onChange={onLanguageChange}
        />

        <div className="topbar-account" ref={accountMenuRef}>
          <button
            type="button"
            className="topbar-account-button"
            onClick={() => setIsAccountMenuOpen((current) => !current)}
            aria-label="Tài khoản"
            aria-expanded={isAccountMenuOpen}
          >
            <AccountIcon />
          </button>

          {isAccountMenuOpen ? (
            <div className="topbar-account-menu">
              <div className="account-menu-profile">
                <strong>{displayName}</strong>
                <span>ADMIN</span>
              </div>

              <button type="button" className="account-menu-item">
                Profile
              </button>
              <button type="button" className="account-menu-item danger" onClick={onLogout}>
                {t.admin.logout}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m21 21-4.3-4.3" />
      <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.5 14.8A8.2 8.2 0 0 1 9.2 3.5 8.5 8.5 0 1 0 20.5 14.8Z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  )
}

export default AdminTopbar
