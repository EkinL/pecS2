<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">Gestion des paiements</h1>
          <p class="mt-2 text-sm text-gray-700">Liste de tous vos paiements et transactions.</p>
        </div>
      </div>
      <div class="mt-4">
        <input
          v-model="search"
          @keyup.enter="doSearch"
          type="text"
          placeholder="Rechercher"
          class="border rounded px-3 py-2 w-full"
        />
      </div>

      <!-- Payments Table -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acheteur
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.id.slice(-8) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatBuyer(payment.buyer, payment.buyer_id) }}
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        v-if="payment.status === 'SUCCESS'"
                        @click="refund(payment.id)"
                        class="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Rembourser
                      </button>
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
        <CreditCard class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par créer votre premier paiement.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { CreditCard } from 'lucide-vue-next'
import sseService from '../../services/sseService'

export default {
  name: 'Payments',
  components: {
    CreditCard
  },
  data() {
    return {
      sse: null,
      search: ''
    }
  },
  computed: {
    ...mapGetters('payments', ['payments', 'loading'])
  },
  async created() {
    await this.fetchPayments()
    sseService.connect()
  },
  beforeUnmount() {
    sseService.close()
  },
  methods: {
    ...mapActions('payments', ['fetchPayments', 'refundPayment']),
    doSearch() {
      this.fetchPayments({ q: this.search })
    },
    async refund(paymentId) {
      await this.refundPayment(paymentId)
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
    formatBuyer(buyer, id) {
      if (!buyer) return id.slice(-8)
      const name = `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim()
      return name || id.slice(-8)
    }
  }
}
</script>
