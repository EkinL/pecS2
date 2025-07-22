<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-2xl font-bold mb-6">Comptes Marchands</h1>
      <table class="min-w-full divide-y divide-gray-200 shadow">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Entreprise
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="m in merchants" :key="m.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ m.companyName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ m.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button @click="approve(m.id)" class="text-green-600 hover:text-green-900">
                Approuver
              </button>
              <button @click="impersonate(m.id)" class="text-indigo-600 hover:text-indigo-900">
                Impersonate
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
  name: 'AdminMerchants',
  computed: {
    ...mapGetters('admin', ['merchants']),
  },
  async created() {
    await this.fetchMerchants()
  },
  methods: {
    ...mapActions('admin', ['fetchMerchants', 'approveMerchant', 'impersonateMerchant']),
    approve(id) {
      this.approveMerchant(id)
    },
    impersonate(id) {
      this.impersonateMerchant(id)
    },
  },
}
</script>
