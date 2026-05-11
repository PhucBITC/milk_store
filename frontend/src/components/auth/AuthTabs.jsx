function AuthTabs({ isLogin, t, onPageChange }) {
  return (
    <div className="auth-switch" role="tablist" aria-label={t.switchLabel}>
      <button
        type="button"
        className={isLogin ? 'active' : ''}
        onClick={() => onPageChange('login')}
        role="tab"
        aria-selected={isLogin}
      >
        {t.loginTab}
      </button>
      <button
        type="button"
        className={!isLogin ? 'active' : ''}
        onClick={() => onPageChange('register')}
        role="tab"
        aria-selected={!isLogin}
      >
        {t.registerTab}
      </button>
    </div>
  )
}

export default AuthTabs
