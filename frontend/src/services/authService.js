import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

export function registerUser(data) {
  return axios.post(`${API_URL}/register`, data)
}

export function loginUser(data) {
  return axios.post(`${API_URL}/login`, data)
}
