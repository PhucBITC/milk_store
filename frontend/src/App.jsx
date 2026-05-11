import { useState } from 'react'
import AdminDashboard from './components/admin/AdminDashboard'
import AuthCard from './components/auth/AuthCard'
import BrandPanel from './components/auth/BrandPanel'
import { registerAccount, validateLogin } from './authStorage'
import { translations } from './translations'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('login')
  const [authMessage, setAuthMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('milkstore-language') || 'vi'
  })
  const t = translations[language]

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage)
    localStorage.setItem('milkstore-language', nextLanguage)
  }

  const handlePageChange = (page) => {
    setAuthMessage('')
    setActivePage(page)
  }

  const handleRegister = ({ email, password }) => {
    if (!email || !password) {
      setAuthMessage(t.authMessages.missingFields)
      return
    }

    registerAccount({ email, password })
    setAuthMessage(t.authMessages.registered)
    setActivePage('login')
  }

  const handleLogin = ({ email, password }) => {
    if (!email || !password) {
      setAuthMessage(t.authMessages.missingFields)
      return
    }

    if (!validateLogin(email, password)) {
      setAuthMessage(t.authMessages.invalidLogin)
      return
    }

    window.alert(t.authMessages.loginSuccess)
    setAuthMessage('')
    setCurrentUser({ email })
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActivePage('login')
  }

  if (currentUser) {
    return (
      <AdminDashboard
        accountEmail={currentUser.email}
        t={t}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <main className="auth-shell">
      <BrandPanel
        language={language}
        t={t}
        onLanguageChange={handleLanguageChange}
      />
      <AuthCard
        activePage={activePage}
        authMessage={authMessage}
        t={t}
        onLogin={handleLogin}
        onPageChange={handlePageChange}
        onRegister={handleRegister}
      />
    </main>
  )
}

export default App
