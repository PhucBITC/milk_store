import { useState } from 'react'

function RegisterForm({ t, onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onRegister({ email: email.trim(), password })
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
