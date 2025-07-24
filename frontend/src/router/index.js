import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

function isTokenExpired(token) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}

// Pages
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Payments from '../views/merchant/Payments.vue'
import Profile from '../views/Profile.vue'
import ClientHistory from '../views/client/History.vue'
import AdminMerchants from '../views/admin/AdminMerchants.vue'
import AdminTransactions from '../views/admin/AdminTransactions.vue'
import AdminClients from '../views/admin/AdminClients.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/payments',
    name: 'Payments',
    component: Payments,
    meta: { requiresAuth: true, requiresMerchant: true },
  },
  {
    path: '/history',
    name: 'History',
    component: ClientHistory,
    meta: { requiresAuth: true, requiresClient: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/clients',
    name: 'AdminClients',
    component: AdminClients,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/merchants',
    name: 'AdminMerchants',
    component: AdminMerchants,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/transactions',
    name: 'AdminTransactions',
    component: AdminTransactions,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    try {
      await store.dispatch('auth/checkAuthStatus')
    } catch {
      // logout handled in action
    }
  }

  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/userRole']
  const token = store.state.auth.token

  if (isAuthenticated && isTokenExpired(token)) {
    await store.dispatch('auth/logout')
    return next('/login')
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresMerchant && userRole !== 'ROLE_MERCHANT') {
    next('/dashboard')
  } else if (to.meta.requiresClient && userRole !== 'ROLE_CLIENT') {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && userRole !== 'ROLE_ADMIN') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
