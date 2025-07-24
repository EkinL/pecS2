import apiClient from './apiClient'

export default {
  async getMerchants() {
    const res = await apiClient.get('/users')
    return res.data.filter((u) => u.role === 'ROLE_MERCHANT')
  },
  async getUsers() {
    const res = await apiClient.get('/users')
    return res.data
  },
  approveMerchant(id) {
    return apiClient.put(`/merchants/${id}`, { approved: true })
  },
  impersonate(id) {
    return apiClient.post(`/auth/impersonate/${id}`)
  },
  getPayments(params) {
    return apiClient.get('/payments', { params })
  },
  getStats() {
    return apiClient.get('/admin/stats')
  },
}
