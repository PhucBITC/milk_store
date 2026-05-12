import axios from 'axios'

const API_URL = 'http://localhost:8080/api/nhom-hang'

export function getNhomHangList() {
  return axios.get(API_URL)
}

export function searchNhomHang(keyword) {
  return axios.get(`${API_URL}/search`, {
    params: { keyword },
  })
}

export function createNhomHang(data) {
  return axios.post(API_URL, data)
}

export function updateNhomHang(maNhomHang, data) {
  return axios.put(`${API_URL}/${maNhomHang}`, data)
}

export function deleteNhomHang(maNhomHang) {
  return axios.delete(`${API_URL}/${maNhomHang}`)
}
