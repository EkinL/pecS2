import axios from "axios"
import store from "../store"
import router from "../router"

const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = store.state.auth.refreshToken
        if (refreshToken) {
          const response = await axios.post("http://localhost:3001/auth/refresh", {
            refreshToken,
          })

          const { accessToken } = response.data
          store.commit("auth/SET_AUTH_DATA", {
            ...store.state.auth,
            token: accessToken,
          })

          localStorage.setItem("token", accessToken)

          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        store.dispatch("auth/logout")
        router.push("/login")
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
