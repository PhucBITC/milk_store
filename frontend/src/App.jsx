import { useState } from 'react'
import AdminDashboard from './components/admin/AdminDashboard'
import AuthCard from './components/auth/AuthCard'
import BrandPanel from './components/auth/BrandPanel'
import { loginUser, registerUser } from './services/authService'
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

  const handleRegister = async (account) => {
    const {
      maTaiKhoan,
      tenTaiKhoan,
      matKhau,
      phanQuyen,
      maCongTy,
      hienHd,
      maCuaHang,
    } = account

    if (
      !maTaiKhoan ||
      !tenTaiKhoan ||
      !matKhau ||
      phanQuyen === '' ||
      !maCongTy ||
      hienHd === ''
    ) {
      setAuthMessage(t.authMessages.missingFields)
      return
    }

    try {
      await registerUser({
        maTaiKhoan,
        tenTaiKhoan,
        matKhau,
        phanQuyen,
        maCongTy,
        hienHd,
        maCuaHang,
      })
      setAuthMessage(t.authMessages.registered)
      setActivePage('login')
    } catch (error) {
      setAuthMessage(error.response?.data?.message || t.authMessages.registerFailed)
    }
  }

  const handleLogin = async ({ maTaiKhoan, matKhau }) => {
    if (!maTaiKhoan || !matKhau) {
      setAuthMessage(t.authMessages.missingFields)
      return
    }

    try {
      const response = await loginUser({ maTaiKhoan, matKhau })
      window.alert(t.authMessages.loginSuccess)
      setAuthMessage('')
      setCurrentUser(response.data.user)
    } catch {
      setAuthMessage(t.authMessages.invalidLogin)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActivePage('login')
  }

  if (currentUser) {
    return (
      <AdminDashboard
        accountEmail={currentUser.maTaiKhoan}
        language={language}
        t={t}
        onLanguageChange={handleLanguageChange}
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
