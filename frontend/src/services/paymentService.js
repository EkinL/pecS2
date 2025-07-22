import apiClient from "../services copy/apiClient"

export default {
  getPayments() {
    return apiClient.get("/payments")
  },

  createPayment(paymentData) {
    return apiClient.post("/payments", paymentData)
  },

  updatePayment(paymentId, data) {
    return apiClient.put(`/payments/${paymentId}`, data)
  },

  deletePayment(paymentId) {
    return apiClient.delete(`/payments/${paymentId}`)
  },
}
