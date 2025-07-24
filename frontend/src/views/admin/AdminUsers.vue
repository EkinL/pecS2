<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-2xl font-bold mb-6">Utilisateurs</h1>
      <table class="min-w-full divide-y divide-gray-200 shadow">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="u in users" :key="u.id">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ u.firstName ? `${u.firstName} ${u.lastName}` : u.companyName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ u.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ roleLabel(u.role) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                v-if="u.role !== 'ROLE_ADMIN'"
                @click="impersonate(u.id)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Se connecter en tant que
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdminUsers',
  computed: {
    ...mapGetters('admin', ['users']),
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    ...mapActions('admin', ['fetchUsers', 'impersonateUser']),
    impersonate(id) {
      this.impersonateUser(id)
    },
    roleLabel(role) {
      switch (role) {
        case 'ROLE_ADMIN':
          return 'Admin'
        case 'ROLE_MERCHANT':
          return 'Marchand'
        case 'ROLE_USER':
          return 'Client'
        default:
          return role
      }
    },
  },
}
</script>
