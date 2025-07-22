import apiClient from './apiClient'

export default {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  register(userData) {
    return apiClient.post('/auth/register', userData)
  },

  refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh', { refreshToken })
  },

  updateProfile(userData) {
    return apiClient.put(`/users/${userData.id}`, userData)
  },

  generateCredentials(userId) {
    return apiClient.post(`/users/${userId}/credentials`)
  },

  getCredentials(userId) {
    return apiClient.get(`/users/${userId}/credentials`)
  },

  getCurrentUser() {
    return apiClient.get('/auth/me')
  },
}
