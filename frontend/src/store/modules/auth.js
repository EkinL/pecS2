import authService from '../../services/authService'

const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  impersonatorData: localStorage.getItem('impersonatorToken')
    ? {
        user: JSON.parse(localStorage.getItem('impersonatorUser')),
        token: localStorage.getItem('impersonatorToken'),
        refreshToken: localStorage.getItem('impersonatorRefreshToken'),
      }
    : null,
  impersonatingUser:
    JSON.parse(localStorage.getItem('impersonatingUser')) || null,
}

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
  userRole: (state) => state.user?.role || null,
  isMerchant: (state) => state.user?.role === 'ROLE_MERCHANT',
  isClient: (state) => state.user?.role === 'ROLE_CLIENT',
  isAdmin: (state) => state.user?.role === 'ROLE_ADMIN',
  isImpersonating: (state) => !!state.impersonatingUser,
  impersonatingUser: (state) => state.impersonatingUser,
}

const mutations = {
  SET_AUTH_DATA(state, { user, token, refreshToken }) {
    state.user = user
    state.token = token
    state.refreshToken = refreshToken
    state.isAuthenticated = true
    localStorage.setItem('user', JSON.stringify(user))
  },
  SET_TOKENS(state, { token, refreshToken }) {
    state.token = token
    state.refreshToken = refreshToken
    state.isAuthenticated = true
  },
  CLEAR_AUTH_DATA(state) {
    state.user = null
    state.token = null
    state.refreshToken = null
    state.isAuthenticated = false
    localStorage.removeItem('user')
  },
  SET_USER(state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  START_IMPERSONATION(state, { user, token, refreshToken }) {
    state.impersonatorData = {
      user: state.user,
      token: state.token,
      refreshToken: state.refreshToken,
    }
    localStorage.setItem('impersonatorUser', JSON.stringify(state.user))
    localStorage.setItem('impersonatorToken', state.token)
    localStorage.setItem('impersonatorRefreshToken', state.refreshToken)
    state.user = user
    state.token = token
    state.refreshToken = refreshToken
    state.isAuthenticated = true
    state.impersonatingUser = user
    localStorage.setItem('impersonatingUser', JSON.stringify(user))
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
  },
  STOP_IMPERSONATION(state) {
    if (!state.impersonatorData) return
    const { user, token, refreshToken } = state.impersonatorData
    state.user = user
    state.token = token
    state.refreshToken = refreshToken
    state.isAuthenticated = true
    state.impersonatorData = null
    state.impersonatingUser = null
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.removeItem('impersonatorUser')
    localStorage.removeItem('impersonatorToken')
    localStorage.removeItem('impersonatorRefreshToken')
    localStorage.removeItem('impersonatingUser')
  },
}

const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await authService.login(credentials)
      const { accessToken, refreshToken } = response.data

      // Stockage des tokens
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      commit('SET_TOKENS', { token: accessToken, refreshToken })

      // Récupération du profil complet
      const me = await authService.getCurrentUser()
      commit('SET_USER', me.data)

      dispatch(
        'ui/showToast',
        {
          type: 'success',
          message: 'Connexion réussie',
        },
        { root: true },
      )

      return response
    } catch (error) {
      dispatch(
        'ui/showToast',
        {
          type: 'error',
          message: error.response?.data?.message || 'Erreur de connexion',
        },
        { root: true },
      )
      throw error
    }
  },

  async register({ dispatch }, userData) {
    try {
      const response = await authService.register(userData)

      dispatch(
        'ui/showToast',
        {
          type: 'success',
          message: 'Inscription réussie',
        },
        { root: true },
      )

      return response
    } catch (error) {
      dispatch(
        'ui/showToast',
        {
          type: 'error',
          message: error.response?.data?.message || "Erreur d'inscription",
        },
        { root: true },
      )
      throw error
    }
  },

  logout({ commit, dispatch }) {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')

    commit('CLEAR_AUTH_DATA')

    dispatch(
      'ui/showToast',
      {
        type: 'info',
        message: 'Déconnexion réussie',
      },
      { root: true },
    )
  },

  async checkAuthStatus({ commit, dispatch }) {

    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!token || !refreshToken) return

    try {
      const response = await authService.getCurrentUser()
      commit('SET_AUTH_DATA', {
        user: response.data,
        token,
        refreshToken,
      })
    } catch (error) {
      await dispatch('logout')
      throw error
    }
  },

  async updateProfile({ commit, dispatch }, userData) {
    try {
      const response = await authService.updateProfile(userData)
      commit('SET_USER', response.data)

      dispatch(
        'ui/showToast',
        {
          type: 'success',
          message: 'Profil mis à jour',
        },
        { root: true },
      )

      return response
    } catch (error) {
      dispatch(
        'ui/showToast',
        {
          type: 'error',
          message: 'Erreur lors de la mise à jour',
        },
        { root: true },
      )
      throw error
    }
  },

  stopImpersonation({ commit }) {
    commit('STOP_IMPERSONATION')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
