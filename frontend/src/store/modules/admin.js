import adminService from '../../services/adminService'

const state = {
  merchants: [],
  payments: [],
  stats: {},
}

const getters = {
  merchants: (state) => state.merchants,
  payments: (state) => state.payments,
  stats: (state) => state.stats,
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
  async impersonateMerchant({ commit }, id) {
    const res = await adminService.impersonate(id)
    const { accessToken, refreshToken, user } = res.data
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    commit('auth/SET_AUTH_DATA', { user, token: accessToken, refreshToken }, { root: true })
  },
  async fetchPayments({ commit }, params) {
    const res = await adminService.getPayments(params)
    commit('SET_PAYMENTS', res.data)
  },
  async fetchStats({ commit }) {
    const res = await adminService.getStats()
    commit('SET_STATS', res.data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
