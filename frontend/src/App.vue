<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <div v-if="isImpersonating" class="bg-yellow-200 text-yellow-800 text-center py-2 text-sm">
      Connecté en tant que :
      {{ impersonatingName }} -
      <button class="underline" @click="stopImpersonation">Se déconnecter</button>
    </div>
    <router-view />
    <Toast />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Navbar from './components/layout/Navbar.vue'
import Toast from './components/common/Toast.vue'


export default {
  name: 'App',
  components: {
    Navbar,
    Toast
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'isImpersonating', 'impersonatingUser']),
    impersonatingName() {
      const u = this.impersonatingUser
      if (!u) return ''
      return u.firstName ? `${u.firstName} ${u.lastName}` : u.companyName
    }
  },
  methods: {
    ...mapActions('auth', ['stopImpersonation'])
  },
  created() {
    this.$store.dispatch('auth/checkAuthStatus')
  }
}
</script>