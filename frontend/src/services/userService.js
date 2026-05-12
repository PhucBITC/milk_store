import axios from 'axios'

const API_URL = 'http://localhost:8080/api/users'

export function getUsers() {
  return axios.get(API_URL)
}

export function getUserByMaTaiKhoan(maTaiKhoan) {
  return axios.get(`${API_URL}/${maTaiKhoan}`)
}

export function createUser(data) {
  return axios.post(API_URL, data)
}

export function updateUser(maTaiKhoan, data) {
  return axios.put(`${API_URL}/${maTaiKhoan}`, data)
}

export function deleteUser(maTaiKhoan) {
  return axios.delete(`${API_URL}/${maTaiKhoan}`)
}
