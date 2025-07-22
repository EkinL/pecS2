<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Créez votre compte
        </p>
      </div>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <!-- Type selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de compte</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input v-model="form.type" type="radio" value="client" class="form-radio text-indigo-600">
                <span class="ml-2">Client</span>
              </label>
              <label class="inline-flex items-center">
                <input v-model="form.type" type="radio" value="merchant" class="form-radio text-indigo-600">
                <span class="ml-2">Marchand</span>
              </label>
            </div>
          </div>

          <!-- Name fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
              <input 
                id="firstName"
                v-model="form.firstName" 
                type="text" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
              <input 
                id="lastName"
                v-model="form.lastName" 
                type="text" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>

          <!-- Merchant specific fields -->
          <div v-if="form.type === 'merchant'" class="space-y-4">
            <div>
              <label for="companyName" class="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <input 
                id="companyName"
                v-model="form.companyName" 
                type="text" 
                :required="form.type === 'merchant'"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label for="kbis" class="block text-sm font-medium text-gray-700">KBIS</label>
              <input 
                id="kbis"
                v-model="form.kbis" 
                type="text" 
                :required="form.type === 'merchant'"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              id="password"
              v-model="form.password" 
              type="password" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </span>
            {{ loading ? 'Inscription...' : 'S\'inscrire' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 transition-colors">
            Déjà un compte ? Se connecter
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        type: 'client',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
        kbis: ''
      },
      loading: false
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    async handleRegister() {
      this.loading = true
      try {
        await this.register(this.form)
        this.$router.push('/login')
      } catch (error) {
        // Error handled by store
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
