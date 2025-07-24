import apiClient from './apiClient'

export default {
  getPayments(params) {
    return apiClient.get('/payments', { params })
  },

  createPayment(paymentData) {
    return apiClient.post("/payments", paymentData)
  },

  updatePayment(paymentId, data) {
    return apiClient.put(`/payments/${paymentId}`, data)
  },

  refundPayment(paymentId) {
    return apiClient.post(`/payments/${paymentId}/refund`)
  },

  deletePayment(paymentId) {
    return apiClient.delete(`/payments/${paymentId}`)
  },
}
