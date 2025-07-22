import { createStore } from 'vuex'
import auth from './modules/auth'
import payments from './modules/payments'
import ui from './modules/ui'
import admin from './modules/admin'

export default createStore({
  modules: {
    auth,
    payments,
    ui,
    admin,
  },
})
