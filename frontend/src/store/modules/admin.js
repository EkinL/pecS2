import adminService from '../../services/adminService'

const state = {
  merchants: [],
  payments: [],
  stats: {},
  users: [],
  activities: [],
}

const getters = {
  merchants: (state) => state.merchants,
  payments: (state) => state.payments,
  stats: (state) => state.stats,
  users: (state) => state.users,
  activities: (state) => state.activities,
}

const mutations = {
  SET_MERCHANTS(state, merchants) {
    state.merchants = merchants
  },
  SET_PAYMENTS(state, payments) {
    state.payments = payments
  },
  SET_STATS(state, stats) {
    state.stats = stats
  },
  SET_USERS(state, users) {
    state.users = users
  },
  SET_PAYMENT_STATUS(state, { id, status }) {
    const p = state.payments.find((pay) => pay.id === id)
    if (p) {
      p.status = status
    }
  },
  SET_ACTIVITIES(state, activities) {
    state.activities = activities
  },
  ADD_ACTIVITY(state, activity) {
    state.activities.unshift(activity)
  },
}

const actions = {
  async fetchMerchants({ commit }) {
    const merchants = await adminService.getMerchants()
    commit('SET_MERCHANTS', merchants)
  },
  async approveMerchant({ dispatch }, id) {
    await adminService.approveMerchant(id)
    await dispatch('fetchMerchants')
  },
  async impersonateMerchant({ dispatch }, id) {
    await dispatch('impersonateUser', id)
  },
  async impersonateUser({ commit, dispatch }, id) {
    try {
      const res = await adminService.impersonate(id)
      const { accessToken, refreshToken, user } = res.data
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      commit(
        'auth/START_IMPERSONATION',
        { user, token: accessToken, refreshToken },
        { root: true }
      )
    } catch (error) {
      dispatch(
        'ui/showToast',
        {
          type: 'error',
          message: error.response?.data?.error || 'Impersonation impossible',
        },
        { root: true }
      )
      throw error
    }
  },
  async fetchUsers({ commit }) {
    const users = await adminService.getUsers()
    commit('SET_USERS', users.filter((u) => u.role !== 'ROLE_ADMIN'))
  },
  async fetchPayments({ commit }, params) {
    const res = await adminService.getPayments(params)
    commit('SET_PAYMENTS', res.data)
  },
  async fetchStats({ commit }) {
    const res = await adminService.getStats()
    commit('SET_STATS', res.data)
  },
  async fetchActivities({ commit }) {
    const res = await adminService.getActivities()
    commit('SET_ACTIVITIES', res.data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
