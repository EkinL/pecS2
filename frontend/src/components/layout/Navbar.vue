<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/dashboard" class="text-xl font-bold text-gray-900">
              PaymentPro
            </router-link>
          </div>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              to="/dashboard"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors"
              :class="
                $route.name === 'Dashboard'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              "
            >
              Dashboard
            </router-link>
            <router-link
              v-if="isMerchant"
              to="/payments"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors"
              :class="
                $route.name === 'Payments'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              "
            >
              Paiements
            </router-link>
            <router-link
              v-if="isClient"
              to="/history"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors"
              :class="
                $route.name === 'History'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              "
            >
              Historique
            </router-link>
            <router-link
              to="/profile"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors"
              :class="
                $route.name === 'Profile'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              "
            >
              Profil
            </router-link>
            <router-link
              v-if="isAdmin"
              to="/admin"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors"
              :class="
                ($route.name || '').startsWith('Admin')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              "
            >
              Admin
            </router-link>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex flex-col items-end">
            <span class="text-sm text-gray-700">{{ user.firstName }} {{ user.lastName }}</span>
            <span v-if="isMerchant" class="text-xs text-gray-500">{{ user.companyName }}</span>
          </div>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="
              isAdmin
                ? 'bg-red-100 text-red-800'
                : isMerchant
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
            "
          >
            {{ isAdmin ? 'Admin' : isMerchant ? 'Marchand' : 'Client' }}
          </span>
          <button @click="handleLogout" class="text-gray-500 hover:text-gray-700 transition-colors">
            <LogOut class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { LogOut } from 'lucide-vue-next'

export default {
  name: 'Navbar',
  components: {
    LogOut,
  },
  computed: {
    ...mapGetters('auth', ['user', 'isMerchant', 'isClient', 'isAdmin']),
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    async handleLogout() {
      await this.logoutAction()
      this.$router.push('/login')
    },
  },
}
</script>
