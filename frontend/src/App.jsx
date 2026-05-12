import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'
import AuthCard from './components/auth/AuthCard'
import BrandPanel from './components/auth/BrandPanel'
import { loginUser, registerUser } from './services/authService'
import { translations } from './translations'
import './App.css'

const authPaths = ['/', '/login', '/register']

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = location.pathname === '/register' ? 'register' : 'login'
  const [authMessage, setAuthMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem('milkstore-current-user')
    return savedUser ? JSON.parse(savedUser) : null
  })
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
    navigate(page === 'register' ? '/register' : '/login')
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
      navigate('/login')
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
      sessionStorage.setItem('milkstore-current-user', JSON.stringify(response.data.user))
      navigate(location.state?.from?.pathname || '/products')
    } catch {
      setAuthMessage(t.authMessages.invalidLogin)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('milkstore-current-user')
    navigate('/login')
  }

  if (currentUser) {
    if (authPaths.includes(location.pathname)) {
      return <Navigate to="/products" replace />
    }

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

  if (!authPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace state={{ from: location }} />
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
