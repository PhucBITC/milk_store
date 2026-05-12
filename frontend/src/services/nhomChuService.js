import axios from 'axios'

const API_URL = 'http://localhost:8080/api/nhom-chu'

export function getNhomChuList() {
  return axios.get(API_URL)
}

export function searchNhomChu(keyword) {
  return axios.get(`${API_URL}/search`, {
    params: { keyword },
  })
}

export function createNhomChu(data) {
  return axios.post(API_URL, data)
}

export function updateNhomChu(maNhom, data) {
  return axios.put(`${API_URL}/${maNhom}`, data)
}

export function deleteNhomChu(maNhom) {
  return axios.delete(`${API_URL}/${maNhom}`)
}
