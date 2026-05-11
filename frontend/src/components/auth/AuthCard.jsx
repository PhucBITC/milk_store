import AuthTabs from './AuthTabs'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

function AuthCard({
  activePage,
  authMessage,
  t,
  onLogin,
  onPageChange,
  onRegister,
}) {
  const isLogin = activePage === 'login'

  return (
    <section className="form-panel" aria-label={t.pageLabel[activePage]}>
      <div className="form-card">
        <div className="form-header">
          <p className="eyebrow">{isLogin ? t.loginEyebrow : t.registerEyebrow}</p>
          <h2>{isLogin ? t.loginTitle : t.registerTitle}</h2>
          <p>{isLogin ? t.loginDescription : t.registerDescription}</p>
        </div>

        <AuthTabs isLogin={isLogin} t={t} onPageChange={onPageChange} />

        {authMessage ? <p className="auth-message">{authMessage}</p> : null}

        {isLogin ? (
          <LoginForm
            t={t}
            onLogin={onLogin}
            onRegister={() => onPageChange('register')}
          />
        ) : (
          <RegisterForm
            t={t}
            onLogin={() => onPageChange('login')}
            onRegister={onRegister}
          />
        )}
      </div>
    </section>
  )
}

export default AuthCard
