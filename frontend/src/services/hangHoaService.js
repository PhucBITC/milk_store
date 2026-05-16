import axios from 'axios'

const API_URL = 'http://localhost:8080/api/hang-hoa'

export function getHangHoaList(maKho) {
  return axios.get(API_URL, {
    params: { maKho }
  })
}

export function searchHangHoa(keyword, maKho) {
  return axios.get(`${API_URL}/search`, {
    params: { keyword, maKho },
  })
}

export function createHangHoa(data) {
  return axios.post(API_URL, data)
}

export function updateHangHoa(maHang, data) {
  return axios.put(`${API_URL}/${maHang}`, data)
}

export function deleteHangHoa(maHang) {
  return axios.delete(`${API_URL}/${maHang}`)
}
