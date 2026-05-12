import axios from 'axios'

const API_URL = 'http://localhost:8080/api/unit-conversions'

export function getUnitConversions() {
  return axios.get(API_URL)
}

export function createUnitConversion(data) {
  return axios.post(API_URL, data)
}

export function updateUnitConversion(MADVT, data) {
  return axios.put(`${API_URL}/${MADVT}`, data)
}

export function deleteUnitConversion(MADVT) {
  return axios.delete(`${API_URL}/${MADVT}`)
}

export function calculateUnitConversion(MADVT) {
  return axios.get(`${API_URL}/${MADVT}/calculate`)
}
