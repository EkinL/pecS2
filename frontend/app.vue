<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav v-if="isAuthenticated" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">PaymentPro</h1>
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <button 
                @click="currentView = 'dashboard'"
                :class="currentView === 'dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium"
              >
                Dashboard
              </button>
              <button 
                v-if="userRole === 'ROLE_MERCHANT'"
                @click="currentView = 'payments'"
                :class="currentView === 'payments' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium"
              >
                Paiements
              </button>
              <button 
                @click="currentView = 'profile'"
                :class="currentView === 'profile' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium"
              >
                Profil
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ userInfo.firstName }} {{ userInfo.lastName }}</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="userRole === 'ROLE_MERCHANT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
              {{ userRole === 'ROLE_MERCHANT' ? 'Marchand' : 'Client' }}
            </span>
            <button @click="logout" class="text-gray-500 hover:text-gray-700">
              <LogOut class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Login/Register Forms -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ isLogin ? 'Connexion' : 'Inscription' }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {{ isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte' }}
          </p>
        </div>
        
        <form @submit.prevent="isLogin ? login() : register()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Type selection for register -->
            <div v-if="!isLogin">
              <label class="block text-sm font-medium text-gray-700">Type de compte</label>
              <div class="mt-2 space-x-4">
                <label class="inline-flex items-center">
                  <input v-model="registerForm.type" type="radio" value="client" class="form-radio text-indigo-600">
                  <span class="ml-2">Client</span>
                </label>
                <label class="inline-flex items-center">
                  <input v-model="registerForm.type" type="radio" value="merchant" class="form-radio text-indigo-600">
                  <span class="ml-2">Marchand</span>
                </label>
              </div>
            </div>

            <!-- Common fields -->
            <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom</label>
                <input v-model="registerForm.firstName" type="text" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <input v-model="registerForm.lastName" type="text" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              </div>
            </div>

            <!-- Merchant specific fields -->
            <div v-if="!isLogin && registerForm.type === 'merchant'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <input v-model="registerForm.companyName" type="text" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">KBIS</label>
                <input v-model="registerForm.kbis" type="text" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
  :value="isLogin ? loginForm.email : registerForm.email"
  @input="isLogin ? loginForm.email = $event.target.value : registerForm.email = $event.target.value"
  type="email"
  required
  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
  :value="isLogin ? loginForm.password : registerForm.password"
  @input="isLogin ? loginForm.password = $event.target.value : registerForm.password = $event.target.value"
  type="password"
  required
  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
/>
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

          <div>
            <button type="submit" :disabled="loading" 
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire') }}
            </button>
          </div>

          <div class="text-center">
            <button type="button" @click="isLogin = !isLogin" class="text-indigo-600 hover:text-indigo-500">
              {{ isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Main Content -->
    <main v-if="isAuthenticated" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Dashboard -->
      <div v-if="currentView === 'dashboard'" class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">
            {{ userRole === 'ROLE_MERCHANT' ? 'Dashboard Marchand' : 'Dashboard Client' }}
          </h1>
          
          <!-- Merchant Dashboard -->
          <div v-if="userRole === 'ROLE_MERCHANT'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <CreditCard class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Paiements totaux</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ payments.length }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <DollarSign class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Revenus totaux</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2) }}€
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <TrendingUp class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Paiements réussis</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ payments.filter(p => p.status === 'SUCCESS').length }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Dashboard -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <ShoppingCart class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Achats totaux</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ clientPayments.length }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <DollarSign class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Montant total dépensé</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ clientPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2) }}€
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payments Management (Merchant only) -->
      <div v-if="currentView === 'payments' && userRole === 'ROLE_MERCHANT'" class="px-4 py-6 sm:px-0">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Gestion des paiements</h1>
            <p class="mt-2 text-sm text-gray-700">Liste de tous vos paiements et transactions.</p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button @click="showCreatePayment = true" 
                    class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
              Nouveau paiement
            </button>
          </div>
        </div>

        <!-- Create Payment Modal -->
        <div v-if="showCreatePayment" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Créer un nouveau paiement</h3>
              <form @submit.prevent="createPayment" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">ID Acheteur</label>
                  <input v-model="newPayment.buyer_id" type="text" required 
                         class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Montant</label>
                  <input v-model="newPayment.amount" type="number" step="0.01" required 
                         class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Devise</label>
                  <select v-model="newPayment.currency" 
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Stripe ID</label>
                  <input v-model="newPayment.stripe_id" type="text" required 
                         class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div class="flex justify-end space-x-3">
                  <button type="button" @click="showCreatePayment = false" 
                          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                    Annuler
                  </button>
                  <button type="submit" 
                          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Payments Table -->
        <div class="mt-8 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acheteur</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="payment in payments" :key="payment._id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment._id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.buyer_id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.amount }}{{ payment.currency }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getStatusClass(payment.status)" 
                              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                          {{ payment.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button @click="updatePaymentStatus(payment._id, 'SUCCESS')" 
                                class="text-indigo-600 hover:text-indigo-900 mr-3">
                          Valider
                        </button>
                        <button @click="deletePayment(payment._id)" 
                                class="text-red-600 hover:text-red-900">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile -->
      <div v-if="currentView === 'profile'" class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Informations du profil</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Détails personnels et informations de l'application.</p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ userInfo.firstName }} {{ userInfo.lastName }}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ userInfo.email }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Rôle</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ userRole === 'ROLE_MERCHANT' ? 'Marchand' : 'Client' }}
                </dd>
              </div>
              <div v-if="userRole === 'ROLE_MERCHANT' && userInfo.companyName" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Entreprise</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ userInfo.companyName }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Credentials Section -->
        <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Credentials API</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Vos clés d'API pour l'intégration.</p>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <button @click="generateCredentials" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ credentials ? 'Régénérer' : 'Générer' }} les credentials
            </button>
            <div v-if="credentials" class="mt-4 p-4 bg-gray-50 rounded-md">
              <p class="text-sm text-gray-600 mb-2">Vos credentials (gardez-les secrets) :</p>
              <code class="text-xs bg-white p-2 rounded border block">{{ credentials }}</code>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { CreditCard, DollarSign, TrendingUp, ShoppingCart, LogOut } from 'lucide-vue-next'


export default {
  name: 'PaymentApp',
  components: {
    CreditCard,
    DollarSign,
    TrendingUp,
    ShoppingCart,
    LogOut
  },
  data() {
    return {
      // Authentication state
      isAuthenticated: false,
      isLogin: true,
      loading: false,
      error: '',
      
      // User data
      userInfo: {},
      userRole: '',
      token: '',
      refreshToken: '',
      
      // Forms
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        type: 'client',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
        kbis: ''
      },
      
      // UI state
      currentView: 'dashboard',
      showCreatePayment: false,
      
      // Data
      payments: [],
      clientPayments: [],
      credentials: '',
      
      // New payment form
      newPayment: {
        buyer_id: '',
        amount: 0,
        currency: 'EUR',
        stripe_id: ''
      }
    }
  },
  
    async mounted() {
    await this.checkAuthStatus()
  },
  
  methods: {
    async checkAuthStatus() {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')

      if (token && refreshToken) {
        this.token = token
        this.refreshToken = refreshToken
        this.isAuthenticated = true
        await this.fetchCurrentUser()
        await this.loadUserData()
      }
    },
    
    async login() {
      this.loading = true
      this.error = ''
      
      try {
        const response = await fetch('https://pecapi.lilianhammache.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        })
        
        let responseBody = ''
        try {
          responseBody = await response.text()
          console.log('Réponse brute du serveur :', responseBody)
          const data = JSON.parse(responseBody)

          if (response.ok && data.user) {
            this.token = data.accessToken
            this.refreshToken = data.refreshToken
            this.userInfo = data.user
            this.userRole = data.user.role || ''
            
            localStorage.setItem('token', this.token)
            localStorage.setItem('refreshToken', this.refreshToken)
            
            this.isAuthenticated = true
            this.loadUserData()
          } else {
            this.error = data.message || data.error || 'Erreur de connexion'
          }
        } catch (parseError) {
          console.error('Échec du parsing JSON :', parseError)
          console.error('Réponse brute du serveur :', responseBody)
          this.error = 'Réponse invalide du serveur'
        }
      } catch (error) {
        console.error('Erreur de connexion au serveur :', error)
        this.error = 'Erreur de connexion au serveur : ' + (error.message || error)
      }
      
      this.loading = false
    },
    
    async register() {
      this.loading = true
      this.error = ''
      
      try {
        const response = await fetch('https://pecapi.lilianhammache.com/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.registerForm)
        })
        
        const data = await response.json()
        
        if (response.ok) {
          this.isLogin = true
          this.loginForm.email = this.registerForm.email
          this.loginForm.password = this.registerForm.password
          await this.login()
        } else {
          this.error = data.message || 'Erreur d\'inscription'
        }
      } catch (error) {
        console.error('Erreur de connexion au serveur :', error)
        this.error = 'Erreur de connexion au serveur : ' + (error.message || error)
      }
      
      this.loading = false
    },
    
    async loadUserData() {
      if (this.userRole === 'ROLE_MERCHANT') {
        await this.loadPayments()
      } else {
        await this.loadClientPayments()
      }
    },
    
    async loadPayments() {
      try {
        const response = await fetch('https://pecapi.lilianhammache.com/payments', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          this.payments = data.filter(payment => payment.seller_id === this.userInfo._id)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error)
      }
    },
    
    async loadClientPayments() {
      try {
        const response = await fetch('https://pecapi.lilianhammache.com/payments', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          this.clientPayments = data.filter(payment => payment.buyer_id === this.userInfo._id)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error)
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await fetch('https://pecapi.lilianhammache.com/auth/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          this.userInfo = data
          this.userRole = data.role || ''
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
      }
    },
    
    async createPayment() {
      try {
        const paymentData = {
          ...this.newPayment,
          seller_id: this.userInfo._id
        }

        const response = await fetch('https://pecapi.lilianhammache.com/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(paymentData)
        })

        const responseBody = await response.text()
        console.log('Réponse brute du serveur :', responseBody)

        if (response.ok) {
          this.showCreatePayment = false
          this.newPayment = {
            buyer_id: '',
            amount: 0,
            currency: 'EUR',
            stripe_id: ''
          }
          await this.loadPayments()
        } else {
          console.error('Erreur lors de la création du paiement :', response.status, responseBody)
          alert(`Erreur ${response.status} : ${responseBody}`)
        }
      } catch (error) {
        console.error('Erreur réseau lors de la création du paiement :', error)
        alert('Erreur réseau : ' + error.message)
      }
    },
    
    async updatePaymentStatus(paymentId, status) {
      try {
        const response = await fetch(`https://pecapi.lilianhammache.com/payments/${paymentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ status })
        })
        
        if (response.ok) {
          await this.loadPayments()
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du paiement:', error)
      }
    },
    
    async deletePayment(paymentId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
        try {
          const response = await fetch(`https://pecapi.lilianhammache.com/payments/${paymentId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          })
          
          if (response.ok) {
            await this.loadPayments()
          }
        } catch (error) {
          console.error('Erreur lors de la suppression du paiement:', error)
        }
      }
    },
    
    async generateCredentials() {
      try {
        const response = await fetch(`https://pecapi.lilianhammache.com/users/${this.userInfo._id}/credentials`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          this.credentials = JSON.stringify(data, null, 2)
        }
      } catch (error) {
        console.error('Erreur lors de la génération des credentials:', error)
      }
    },
    
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      this.isAuthenticated = false
      this.userInfo = {}
      this.userRole = ''
      this.token = ''
      this.currentView = 'dashboard'
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'SUCCESS':
          return 'bg-green-100 text-green-800'
        case 'PENDING':
          return 'bg-yellow-100 text-yellow-800'
        case 'FAILED':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
  }
}
</script>
