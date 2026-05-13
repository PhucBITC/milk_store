import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminDashboard from './components/admin/AdminDashboard'
import AuthCard from './components/auth/AuthCard'
import BrandPanel from './components/auth/BrandPanel'
import { loginUser, registerUser } from './services/authService'
import { translations } from './translations'
import './App.css'
import './theme.css'

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
      const msg = t.authMessages.missingFields
      setAuthMessage(msg)
      toast.warn(msg)
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
      const successMsg = t.authMessages.registered
      setAuthMessage(successMsg)
      toast.success(successMsg)
      navigate('/login')
    } catch (error) {
      const errorMsg = error.response?.data?.message || t.authMessages.registerFailed
      setAuthMessage(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleLogin = async ({ maTaiKhoan, matKhau }) => {
    if (!maTaiKhoan || !matKhau) {
      const msg = t.authMessages.missingFields
      setAuthMessage(msg)
      toast.warn(msg)
      return
    }

    try {
      const response = await loginUser({ maTaiKhoan, matKhau })
      toast.success(t.authMessages.loginSuccess || 'Đăng nhập thành công!')
      setAuthMessage('')
      setCurrentUser(response.data.user)
      sessionStorage.setItem('milkstore-current-user', JSON.stringify(response.data.user))
      navigate(location.state?.from?.pathname || '/products')
    } catch {
      const errorMsg = t.authMessages.invalidLogin
      setAuthMessage(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('milkstore-current-user')
    toast.info('Đã đăng xuất khỏi hệ thống.')
    navigate('/login')
  }

  if (currentUser) {
    if (authPaths.includes(location.pathname)) {
      return <Navigate to="/products" replace />
    }

    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <AdminDashboard
          accountEmail={currentUser.maTaiKhoan}
          language={language}
          t={t}
          onLanguageChange={handleLanguageChange}
          onLogout={handleLogout}
        />
      </>
    )
  }

  if (!authPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
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
    </>
  )
}

export default App
