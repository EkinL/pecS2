<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-2xl font-bold mb-6">Recherche Transactions</h1>
      <div class="mb-4">
        <input
          v-model="search"
          @keyup.enter="doSearch"
          type="text"
          placeholder="Rechercher"
          class="border rounded px-3 py-2 w-full"
        />
      </div>
      <table class="min-w-full divide-y divide-gray-200 shadow">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Montant
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Statut
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="p in payments" :key="p.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ p.id.slice(-8) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ p.amount }}{{ p.currency }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ p.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdminTransactions',
  data() {
    return { search: '' }
  },
  computed: {
    ...mapGetters('admin', ['payments']),
  },
  methods: {
    ...mapActions('admin', ['fetchPayments']),
    doSearch() {
      this.fetchPayments({ q: this.search })
    },
  },
}
</script>
