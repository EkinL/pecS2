<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Informations du profil</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Détails personnels et informations de l'application.
            </p>
          </div>
          <button
            @click="toggleEditProfile"
            class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {{ editingProfile ? 'Annuler' : 'Modifier' }}
          </button>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ user.firstName }} {{ user.lastName }}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.email }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Rôle</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ isMerchant ? 'Marchand' : 'Client' }}
              </dd>
            </div>
            <div
              v-if="isMerchant && user.companyName"
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Entreprise</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ user.companyName }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          @click="toggleEditProfile"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          {{ editingProfile ? 'Annuler la modification' : 'Modifier mon profil' }}
        </button>
      </div>

      <!-- Credentials Section -->
      <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Credentials API</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Vos clés d'API pour l'intégration.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <button
            @click="handleGenerateCredentials"
            :disabled="credentialsLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Key class="h-4 w-4 mr-2" />
            {{ credentialsLoading ? 'Génération...' : credentials ? 'Régénérer' : 'Générer' }} les
            credentials
          </button>

          <div v-if="credentials" class="mt-4 p-4 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-600 mb-2">Vos credentials (gardez-les secrets) :</p>
            <div class="bg-white p-3 rounded border font-mono text-xs break-all">
              {{ credentials }}
            </div>
            <button
              @click="copyCredentials"
              class="mt-2 text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Copier dans le presse-papiers
            </button>
          </div>
        </div>
      </div>

      <!-- Update Profile Section -->
      <div v-if="editingProfile" class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Mettre à jour mes informations
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Modifiez votre nom et votre email.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700"
                  >Prénom</label
                >
                <input
                  id="firstName"
                  v-model="profileForm.firstName"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  id="lastName"
                  v-model="profileForm.lastName"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="profileLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {{ profileLoading ? 'Mise à jour...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Key } from 'lucide-vue-next'
import authService from '../services/authService'

export default {
  name: 'Profile',
  components: {
    Key,
  },
  data() {
    return {
      credentials: '',
      credentialsLoading: false,
      profileForm: {
        firstName: '',
        lastName: '',
        email: '',
      },
      profileLoading: false,
      editingProfile: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'isMerchant']),
  },
  async created() {
    await this.checkAuthStatus()
    if (!this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/login')
      return
    }
    this.profileForm.firstName = this.user.firstName
    this.profileForm.lastName = this.user.lastName
    this.profileForm.email = this.user.email
  },
  methods: {
    ...mapActions('ui', ['showToast']),
    ...mapActions('auth', ['updateProfile', 'checkAuthStatus']),
    toggleEditProfile() {
      this.editingProfile = !this.editingProfile
      if (this.editingProfile) {
        this.profileForm.firstName = this.user.firstName
        this.profileForm.lastName = this.user.lastName
        this.profileForm.email = this.user.email
      }
    },
    async handleGenerateCredentials() {
      this.credentialsLoading = true
      try {
        const response = await authService.generateCredentials(this.user._id)
        this.credentials = JSON.stringify(response.data, null, 2)

        this.showToast({
          type: 'success',
          message: 'Credentials générés avec succès',
        })
      } catch (error) {
        this.showToast({
          type: 'error',
          message: 'Erreur lors de la génération des credentials',
        })
      } finally {
        this.credentialsLoading = false
      }
    },
    async copyCredentials() {
      try {
        await navigator.clipboard.writeText(this.credentials)
        this.showToast({
          type: 'success',
          message: 'Credentials copiés dans le presse-papiers',
        })
      } catch (error) {
        this.showToast({
          type: 'error',
          message: 'Erreur lors de la copie',
        })
      }
    },
    async handleUpdateProfile() {
      this.profileLoading = true
      try {
        await this.updateProfile({
          id: this.user._id,
          firstName: this.profileForm.firstName,
          lastName: this.profileForm.lastName,
          email: this.profileForm.email,
        })
        this.editingProfile = false
      } catch (error) {
        // Error handled by store
      } finally {
        this.profileLoading = false
      }
    },
  },
}
</script>
