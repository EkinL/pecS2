const state = {
  toast: {
    show: false,
    type: "info",
    message: "",
  },
}

const mutations = {
  SHOW_TOAST(state, { type, message }) {
    state.toast = {
      show: true,
      type,
      message,
    }
  },
  HIDE_TOAST(state) {
    state.toast.show = false
  },
}

const actions = {
  showToast({ commit }, { type, message }) {
    commit("SHOW_TOAST", { type, message })
    setTimeout(() => {
      commit("HIDE_TOAST")
    }, 4000)
  },
  hideToast({ commit }) {
    commit("HIDE_TOAST")
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
