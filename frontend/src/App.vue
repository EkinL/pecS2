<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <router-view />
    <Toast />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from './components/layout/Navbar.vue'
import Toast from './components/common/Toast.vue'


export default {
  name: 'App',
  components: {
    Navbar,
    Toast
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  created() {
    this.$store.dispatch('auth/checkAuthStatus')
  }
}
</script>