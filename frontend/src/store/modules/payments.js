import paymentService from "../../services/paymentService"

const state = {
  payments: [],
  loading: false,
}

const getters = {
  payments: (state) => state.payments,
  loading: (state) => state.loading,
  totalAmount: (state) => state.payments.reduce((sum, payment) => sum + payment.amount, 0),
  successfulPayments: (state) => state.payments.filter((p) => p.status === "SUCCESS"),
  pendingPayments: (state) => state.payments.filter((p) => p.status === "PENDING"),
}

const mutations = {
  SET_PAYMENTS(state, payments) {
    state.payments = payments
  },
  ADD_PAYMENT(state, payment) {
    state.payments.unshift(payment)
  },
  UPDATE_PAYMENT(state, updatedPayment) {
    const index = state.payments.findIndex((p) => p.id === updatedPayment.id)
    if (index !== -1) {
      state.payments.splice(index, 1, updatedPayment)
    }
  },
  SET_PAYMENT_STATUS(state, { id, status }) {
    const p = state.payments.find((pay) => pay.id === id)
    if (p) {
      p.status = status
    }
  },
  REMOVE_PAYMENT(state, paymentId) {
    state.payments = state.payments.filter((p) => p.id !== paymentId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
}

const actions = {
  async fetchPayments({ commit, rootGetters, dispatch }) {
    commit("SET_LOADING", true)
    try {
      const response = await paymentService.getPayments()
      const userId = rootGetters["auth/user"].id
      const userRole = rootGetters["auth/userRole"]

      let filteredPayments = response.data
      if (userRole === "ROLE_MERCHANT") {
        filteredPayments = response.data.filter((p) => p.seller_id === userId)
      } else {
        filteredPayments = response.data.filter((p) => p.buyer_id === userId)
      }

      commit("SET_PAYMENTS", filteredPayments)
    } catch (error) {
      dispatch(
        "ui/showToast",
        {
          type: "error",
          message: "Erreur lors du chargement des paiements",
        },
        { root: true },
      )
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async createPayment({ commit, rootGetters, dispatch }, paymentData) {
    try {
      const sellerId = rootGetters["auth/user"].id
      const response = await paymentService.createPayment({
        ...paymentData,
        seller_id: sellerId,
      })

      commit("ADD_PAYMENT", response.data)

      dispatch(
        "ui/showToast",
        {
          type: "success",
          message: "Paiement créé avec succès",
        },
        { root: true },
      )

      return response
    } catch (error) {
      dispatch(
        "ui/showToast",
        {
          type: "error",
          message: "Erreur lors de la création du paiement",
        },
        { root: true },
      )
      throw error
    }
  },

  async updatePayment({ commit, dispatch }, { paymentId, data }) {
    try {
      const response = await paymentService.updatePayment(paymentId, data)
      commit("UPDATE_PAYMENT", response.data)

      dispatch(
        "ui/showToast",
        {
          type: "success",
          message: "Paiement mis à jour",
        },
        { root: true },
      )

      return response
    } catch (error) {
      dispatch(
        "ui/showToast",
        {
          type: "error",
          message: "Erreur lors de la mise à jour",
        },
        { root: true },
      )
      throw error
    }
  },

  async refundPayment({ commit, dispatch }, paymentId) {
    try {
      const res = await paymentService.refundPayment(paymentId)
      commit('UPDATE_PAYMENT', res.data)

      dispatch(
        'ui/showToast',
        {
          type: 'success',
          message: 'Paiement remboursé',
        },
        { root: true },
      )

      return res
    } catch (error) {
      dispatch(
        'ui/showToast',
        {
          type: 'error',
          message: 'Erreur lors du remboursement',
        },
        { root: true },
      )
      throw error
    }
  },

  async deletePayment({ commit, dispatch }, paymentId) {
    try {
      await paymentService.deletePayment(paymentId)
      commit("REMOVE_PAYMENT", paymentId)

      dispatch(
        "ui/showToast",
        {
          type: "success",
          message: "Paiement supprimé",
        },
        { root: true },
      )
    } catch (error) {
      dispatch(
        "ui/showToast",
        {
          type: "error",
          message: "Erreur lors de la suppression",
        },
        { root: true },
      )
      throw error
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
