<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">Gestion des paiements</h1>
          <p class="mt-2 text-sm text-gray-700">Liste de tous vos paiements et transactions.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button 
            @click="showCreateModal = true" 
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <Plus class="h-4 w-4 mr-2" />
            Nouveau paiement
          </button>
        </div>
      </div>

      <!-- Create Payment Modal -->
      <CreatePaymentModal 
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handlePaymentCreated"
      />

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
                      {{ payment.buyer_id.slice(-8) }}
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
                        v-if="payment.status !== 'SUCCESS'"
                        @click="updateStatus(payment.id, 'SUCCESS')"
                        class="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Valider
                      </button>
                      <button 
                        @click="confirmDelete(payment.id)"
                        class="text-red-600 hover:text-red-900 transition-colors"
                      >
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
import { Plus, CreditCard } from 'lucide-vue-next'
import CreatePaymentModal from '../../components/modals/CreatePaymentModal.vue'

export default {
  name: 'Payments',
  components: {
    Plus,
    CreditCard,
    CreatePaymentModal
  },
  data() {
    return {
      showCreateModal: false
    }
  },
  computed: {
    ...mapGetters('payments', ['payments', 'loading'])
  },
  async created() {
    await this.fetchPayments()
  },
  methods: {
    ...mapActions('payments', ['fetchPayments', 'updatePayment', 'deletePayment']),
    async updateStatus(paymentId, status) {
      await this.updatePayment({ paymentId, data: { status } })
    },
    async confirmDelete(paymentId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
        await this.deletePayment(paymentId)
      }
    },
    handlePaymentCreated() {
      this.showCreateModal = false
      this.fetchPayments()
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
