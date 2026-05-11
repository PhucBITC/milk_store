import { useState } from 'react'

function LoginForm({ t, onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ email: email.trim(), password })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        {t.email}
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label>
        {t.password}
        <input
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
