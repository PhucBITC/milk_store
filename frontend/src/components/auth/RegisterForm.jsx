import { useState } from 'react'

function RegisterForm({ t, onLogin, onRegister }) {
  const [maTaiKhoan, setMaTaiKhoan] = useState('')
  const [tenTaiKhoan, setTenTaiKhoan] = useState('')
  const [matKhau, setMatKhau] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onRegister({
      maTaiKhoan: maTaiKhoan.trim(),
      tenTaiKhoan: tenTaiKhoan.trim(),
      matKhau,
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        {t.maTaiKhoan}
        <input
          type="text"
          placeholder={t.maTaiKhoanPlaceholder}
          value={maTaiKhoan}
          onChange={(event) => setMaTaiKhoan(event.target.value)}
        />
      </label>

      <label>
        {t.tenTaiKhoan}
        <input
          type="text"
          placeholder={t.tenTaiKhoanPlaceholder}
          value={tenTaiKhoan}
          onChange={(event) => setTenTaiKhoan(event.target.value)}
        />
      </label>

      <label>
        {t.matKhau}
        <input
          type="password"
          placeholder={t.matKhauPlaceholder}
          value={matKhau}
          onChange={(event) => setMatKhau(event.target.value)}
        />
      </label>

      <button type="submit" className="primary-action">
        {t.createAccount}
      </button>

      <p className="form-note">
        {t.hasAccount}{' '}
        <button type="button" onClick={onLogin}>
          {t.loginTab}
        </button>
      </p>
    </form>
  )
}

export default RegisterForm
