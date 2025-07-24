<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">Historique des achats</h1>
          <p class="mt-2 text-sm text-gray-700">Toutes vos transactions et achats.</p>
        </div>
      </div>

      <!-- History Table -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendeur
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(payment.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatSeller(payment.seller, payment.seller_id) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.amount }}{{ payment.currency }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(payment.status)" 
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ payment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && payments.length === 0" class="text-center py-12">
        <ShoppingCart class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun achat</h3>
        <p class="mt-1 text-sm text-gray-500">Vous n'avez encore effectué aucun achat.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ShoppingCart } from 'lucide-vue-next'

export default {
  name: 'History',
  components: {
    ShoppingCart
  },
  computed: {
    ...mapGetters('payments', ['payments', 'loading'])
  },
  async created() {
    await this.fetchPayments()
  },
  methods: {
    ...mapActions('payments', ['fetchPayments']),
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatusClass(status) {
      switch (status) {
        case 'SUCCESS':
          return 'bg-green-100 text-green-800'
        case 'PENDING':
          return 'bg-yellow-100 text-yellow-800'
        case 'FAILED':
          return 'bg-red-100 text-red-800'
        case 'REFUNDED':
          return 'bg-gray-200 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    formatSeller(seller, id) {
      if (!seller) return id.slice(-8)
      if (seller.role === 'ROLE_MERCHANT' && seller.companyName) {
        return seller.companyName
      }
      const name = `${seller.firstName || ''} ${seller.lastName || ''}`.trim()
      return name || id.slice(-8)
    }
  }
}
</script>
