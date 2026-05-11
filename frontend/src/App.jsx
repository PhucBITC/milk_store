import { useState } from 'react'
import './App.css'

const distributorTypes = [
  'Nha phan phoi khu vuc',
  'Dai ly cap 1',
  'Chuoi cua hang sua',
  'Kho ban si',
]

function App() {
  const [activePage, setActivePage] = useState('login')
  const isLogin = activePage === 'login'

  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label="Milkstore overview">
        <div className="brand-topline">
          <span className="brand-mark">M</span>
          <span>ME XIU</span>
        </div>

        <div className="brand-copy">
          <p className="eyebrow">Quan ly sua da nha phan phoi</p>
          <h1>Van hanh don hang, ton kho va dai ly trong mot he thong.</h1>
          <p>
            Nen tang mau cho doanh nghiep phan phoi sua: theo doi nha cung cap,
            quan ly dai ly, kiem soat han su dung va dieu phoi giao hang moi
            ngay.
          </p>
        </div>

        <div className="metric-grid" aria-label="Sample business metrics">
          <article>
            <strong>128</strong>
            <span>Dai ly dang hoat dong</span>
          </article>
          <article>
            <strong>24k</strong>
            <span>Hop sua trong kho</span>
          </article>
          <article>
            <strong>97%</strong>
            <span>Don giao dung han</span>
          </article>
        </div>
      </section>

      <section className="form-panel" aria-label={isLogin ? 'Dang nhap' : 'Dang ki'}>
        <div className="form-card">
          <div className="form-header">
            <p className="eyebrow">{isLogin ? 'Chao mung tro lai' : 'Tao tai khoan moi'}</p>
            <h2>{isLogin ? 'Dang nhap he thong' : 'Dang ki nha phan phoi'}</h2>
            <p>
              {isLogin
                ? 'Su dung tai khoan noi bo de truy cap bang dieu khien MilkStore.'
                : 'Du lieu hien tai la mau de ban thiet ke va kiem thu giao dien.'}
            </p>
          </div>

          <div className="auth-switch" role="tablist" aria-label="Chon trang">
            <button
              type="button"
              className={isLogin ? 'active' : ''}
              onClick={() => setActivePage('login')}
              role="tab"
              aria-selected={isLogin}
            >
              Dang nhap
            </button>
            <button
              type="button"
              className={!isLogin ? 'active' : ''}
              onClick={() => setActivePage('register')}
              role="tab"
              aria-selected={!isLogin}
            >
              Dang ki
            </button>
          </div>

          {isLogin ? (
            <LoginForm onRegister={() => setActivePage('register')} />
          ) : (
            <RegisterForm onLogin={() => setActivePage('login')} />
          )}
        </div>
      </section>
    </main>
  )
}

function LoginForm({ onRegister }) {
  return (
    <form className="auth-form">
      <label>
        Email hoac ma nhan vien
        <input type="text" placeholder="admin@milkstore.vn" defaultValue="admin@milkstore.vn" />
      </label>

      <label>
        Mat khau
        <input type="password" placeholder="Nhap mat khau" defaultValue="milkstore123" />
      </label>

      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Ghi nho dang nhap
        </label>
        <a href="#forgot">Quen mat khau?</a>
      </div>

      <button type="button" className="primary-action">
        Dang nhap
      </button>

      <p className="form-note">
        Chua co tai khoan?{' '}
        <button type="button" onClick={onRegister}>
          Dang ki nha phan phoi
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onLogin }) {
  return (
    <form className="auth-form">
      <div className="field-grid">
        <label>
          Ten doanh nghiep
          <input type="text" placeholder="Cong ty Sua An Phu" />
        </label>
        <label>
          Loai nha phan phoi
          <select defaultValue={distributorTypes[0]}>
            {distributorTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Email quan tri
        <input type="email" placeholder="owner@daily-sua.vn" />
      </label>

      <div className="field-grid">
        <label>
          So dien thoai
          <input type="tel" placeholder="0901 234 567" />
        </label>
        <label>
          Khu vuc phu trach
          <input type="text" placeholder="TP.HCM, Binh Duong" />
        </label>
      </div>

      <label>
        Mat khau
        <input type="password" placeholder="Toi thieu 8 ki tu" />
      </label>

      <button type="button" className="primary-action">
        Tao tai khoan mau
      </button>

      <p className="form-note">
        Da co tai khoan?{' '}
        <button type="button" onClick={onLogin}>
          Dang nhap
        </button>
      </p>
    </form>
  )
}

export default App
