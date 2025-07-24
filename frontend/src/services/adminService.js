import apiClient from './apiClient'

export default {
  getMerchants() {
    return apiClient.get('/merchants')
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
}
