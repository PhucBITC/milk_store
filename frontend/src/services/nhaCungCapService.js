import axios from 'axios'

const API_URL = 'http://localhost:8080/api/nha-cung-cap'

export function getNhaCungCapList() {
  return axios.get(API_URL)
}

export function searchNhaCungCap(keyword) {
  return axios.get(`${API_URL}/search`, {
    params: { keyword },
  })
}

export function createNhaCungCap(data) {
  return axios.post(API_URL, data)
}

export function updateNhaCungCap(maNhaCungCap, data) {
  return axios.put(`${API_URL}/${maNhaCungCap}`, data)
}

export function deleteNhaCungCap(maNhaCungCap) {
  return axios.delete(`${API_URL}/${maNhaCungCap}`)
}
