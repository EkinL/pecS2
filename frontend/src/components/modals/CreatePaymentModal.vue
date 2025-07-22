<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Créer un nouveau paiement</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="buyer_id" class="block text-sm font-medium text-gray-700">ID Acheteur</label>
            <input 
              id="buyer_id"
              v-model="form.buyer_id" 
              type="text" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ID de l'acheteur"
            >
          </div>
          
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Montant</label>
            <input 
              id="amount"
              v-model="form.amount" 
              type="number" 
              step="0.01" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            >
          </div>
          
          <div>
            <label for="currency" class="block text-sm font-medium text-gray-700">Devise</label>
            <select 
              id="currency"
              v-model="form.currency" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          
          <div>
            <label for="stripe_id" class="block text-sm font-medium text-gray-700">Stripe ID</label>
            <input 
              id="stripe_id"
              v-model="form.stripe_id" 
              type="text" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="stripe_payment_id"
            >
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { X } from 'lucide-vue-next'

export default {
  name: 'CreatePaymentModal',
  components: {
    X
  },
  emits: ['close', 'created'],
  data() {
    return {
      form: {
        buyer_id: '',
        amount: 0,
        currency: 'EUR',
        stripe_id: ''
      },
      loading: false
    }
  },
  methods: {
    ...mapActions('payments', ['createPayment']),
    async handleSubmit() {
      this.loading = true
      try {
        await this.createPayment(this.form)
        this.$emit('created')
      } catch (error) {
        // Error handled by store
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
