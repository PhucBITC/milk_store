import { useState } from 'react'

function RegisterForm({ t, onLogin, onRegister }) {
  const [maTaiKhoan, setMaTaiKhoan] = useState('')
  const [tenTaiKhoan, setTenTaiKhoan] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [phanQuyen, setPhanQuyen] = useState('1')
  const [maCongTy, setMaCongTy] = useState('01')
  const [maCuaHang, setMaCuaHang] = useState('')
  const [hienHd, setHienHd] = useState(true)

  const handleSubmit = (event) => {
    event.preventDefault()
    onRegister({
      maTaiKhoan: maTaiKhoan.trim(),
      tenTaiKhoan: tenTaiKhoan.trim(),
      matKhau,
      phanQuyen: Number(phanQuyen),
      maCongTy: maCongTy.trim(),
      hienHd: hienHd ? 1 : 0,
      maCuaHang: maCuaHang.trim(),
    })
  }

  return (
    <form className="auth-form register-form" onSubmit={handleSubmit}>
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

      <label>
        {t.phanQuyen}
        <select
          value={phanQuyen}
          onChange={(event) => setPhanQuyen(event.target.value)}
        >
          <option value="1">{t.roleAdmin}</option>
          <option value="2">{t.roleAccountant}</option>
          <option value="3">{t.roleGeneralAccountant}</option>
          <option value="4">{t.roleSales}</option>
        </select>
      </label>

      <label>
        {t.maCongTy}
        <input
          type="text"
          placeholder={t.maCongTyPlaceholder}
          value={maCongTy}
          onChange={(event) => setMaCongTy(event.target.value)}
        />
      </label>

      <label>
        {t.maCuaHang}
        <input
          type="text"
          placeholder={t.maCuaHangPlaceholder}
          value={maCuaHang}
          onChange={(event) => setMaCuaHang(event.target.value)}
        />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={hienHd}
          onChange={(event) => setHienHd(event.target.checked)}
        />
        {t.hienHd}
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
