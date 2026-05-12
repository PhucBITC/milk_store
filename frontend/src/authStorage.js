const ACCOUNT_KEY = 'milkstore-account'

export function registerAccount(account) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account))
}

export function getRegisteredAccount() {
  const accountJson = localStorage.getItem(ACCOUNT_KEY)

  if (!accountJson) {
    return null
  }

  try {
    return JSON.parse(accountJson)
  } catch {
    localStorage.removeItem(ACCOUNT_KEY)
    return null
  }
}

export function validateLogin(maTaiKhoan, matKhau) {
  const account = getRegisteredAccount()

  if (!account) {
    return false
  }

  return account.maTaiKhoan === maTaiKhoan && account.matKhau === matKhau
}
