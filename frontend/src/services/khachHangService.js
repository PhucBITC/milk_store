import axios from 'axios'

const API_URL = 'http://localhost:8080/api/khach-hang'

export function getKhachHangList() {
  return axios.get(API_URL)
}

export function searchKhachHang(keyword) {
  return axios.get(`${API_URL}/search`, {
    params: { keyword },
  })
}

export function createKhachHang(data) {
  return axios.post(API_URL, data)
}

export function updateKhachHang(maKhachHang, data) {
  return axios.put(`${API_URL}/${maKhachHang}`, data)
}

export function deleteKhachHang(maKhachHang) {
  return axios.delete(`${API_URL}/${maKhachHang}`)
}
