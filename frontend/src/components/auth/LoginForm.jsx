import { useState } from 'react'

function LoginForm({ t, onLogin, onRegister }) {
  const [maTaiKhoan, setMaTaiKhoan] = useState('')
  const [matKhau, setMatKhau] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ maTaiKhoan: maTaiKhoan.trim(), matKhau })
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
        {t.matKhau}
        <input
          type="password"
          placeholder={t.matKhauPlaceholder}
          value={matKhau}
          onChange={(event) => setMatKhau(event.target.value)}
        />
      </label>

      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          {t.rememberMe}
        </label>
        <a href="#forgot">{t.forgotPassword}</a>
      </div>

      <button type="submit" className="primary-action">
        {t.loginAction}
      </button>

      <p className="form-note">
        {t.noAccount}{' '}
        <button type="button" onClick={onRegister}>
          {t.registerAccount}
        </button>
      </p>
    </form>
  )
}

export default LoginForm
