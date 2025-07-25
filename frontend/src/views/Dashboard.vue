<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ dashboardTitle }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          Bienvenue {{ user.firstName }}, voici un aperçu de votre activité
        </p>
      </div>
      
      <!-- Admin Dashboard -->
      <div v-if="isAdmin">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Comptes marchands" :value="stats.totalMerchants ?? 0" icon="Users" color="purple" />
          <StatsCard title="Comptes clients" :value="stats.totalClients ?? 0" icon="Users" color="green" />
          <StatsCard title="Transactions" :value="stats.totalTransactions ?? 0" icon="CreditCard" color="blue" />
          <StatsCard title="Revenus" :value="`${stats.totalAmount?.toFixed(2) || 0}€`" icon="DollarSign" color="yellow" />
        </div>

        <div class="mt-8">
          <BarChart :data="chartData" :labels="['Marchands','Clients','Transactions']" />
        </div>
      </div>

      <!-- Merchant Dashboard -->
      <div v-else-if="isMerchant" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Paiements totaux"
          :value="payments.length"
          icon="CreditCard"
          color="blue"
        />
        <StatsCard
          title="Revenus totaux"
          :value="`${totalAmount.toFixed(2)}€`"
          icon="DollarSign"
          color="green"
        />
        <StatsCard
          title="Paiements réussis"
          :value="successfulPayments.length"
          icon="TrendingUp"
          color="purple"
        />
      </div>

      <!-- Client Dashboard -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Achats totaux"
          :value="payments.length"
          icon="ShoppingCart"
          color="blue"
        />
        <StatsCard
          title="Montant dépensé"
          :value="`${totalAmount.toFixed(2)}€`"
          icon="DollarSign"
          color="green"
        />
      </div>

      <!-- Recent Activity -->
      <div class="mt-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Activité récente</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              {{ isAdmin ? 'Dernières actions sur les comptes' : 'Vos dernières transactions' }}
            </p>
          </div>
          <ul v-if="!isAdmin" class="divide-y divide-gray-200">
            <li v-for="payment in recentPayments" :key="payment.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <CreditCard class="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ payment.amount }}{{ payment.currency }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ isMerchant ? `Acheteur: ${formatBuyer(payment.buyer, payment.buyer_id)}` : `Vendeur: ${formatSeller(payment.seller, payment.seller_id)}` }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span :class="getStatusClass(payment.status)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ payment.status }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="act in recentActivities" :key="act.date" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User class="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ act.name }}</div>
                    <div class="text-sm text-gray-500">
                      {{ act.action === 'CREATED' ? 'Compte créé' : 'Compte modifié' }}
                    </div>
                  </div>
                </div>
                <div class="text-sm text-gray-500">{{ new Date(act.date).toLocaleDateString() }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { CreditCard, User } from 'lucide-vue-next'
import StatsCard from '../components/common/StatsCard.vue'
import BarChart from '../components/common/BarChart.vue'
import statsSseService from '../services/statsSseService'
import activitySseService from '../services/activitySseService'

export default {
  name: 'Dashboard',
  components: {
    CreditCard,
    User,
    StatsCard,
    BarChart
  },
  computed: {
    ...mapGetters('auth', ['user', 'isMerchant', 'isAdmin']),
    ...mapGetters('payments', ['payments', 'totalAmount', 'successfulPayments']),
    ...mapGetters('admin', { adminPayments: 'payments', stats: 'stats', adminActivities: 'activities' }),
    dashboardTitle() {
      if (this.isAdmin) return 'Dashboard Admin'
      return this.isMerchant ? 'Dashboard Marchand' : 'Dashboard Client'
    },
    chartData() {
      return [
        this.stats.totalMerchants || 0,
        this.stats.totalClients || 0,
        this.stats.totalTransactions || 0,
      ]
    },
    recentPayments() {
      const list = this.isAdmin ? this.adminPayments : this.payments
      return list.slice(0, 5)
    }
    ,recentActivities() {
      return this.adminActivities.slice(0, 5)
    }
  },
  async created() {
    await this.fetchPayments()
    if (this.isAdmin) {
      await Promise.all([this.fetchStats(), this.fetchAdminPayments(), this.fetchActivities()])
      statsSseService.connect()
      activitySseService.connect()
    }
  },
  beforeUnmount() {
    if (this.isAdmin) {
      statsSseService.close()
      activitySseService.close()
    }
  },
  beforeUnmount() {
    if (this.isAdmin) statsSseService.close()
  },
  methods: {
    ...mapActions('payments', ['fetchPayments']),
    ...mapActions('admin', { fetchAdminPayments: 'fetchPayments', fetchStats: 'fetchStats', fetchActivities: 'fetchActivities' }),
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
    },
    formatSeller(seller, id) {
      if (!seller) return id.slice(-8)
      if (seller.role === 'ROLE_MERCHANT' && seller.companyName) {
        return seller.companyName
      }
      const name = `${seller.firstName || ''} ${seller.lastName || ''}`.trim()
      return name || id.slice(-8)
    },
    formatBuyer(buyer, id) {
      if (!buyer) return id.slice(-8)
      const name = `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim()
      return name || id.slice(-8)
    }
  }
}
</script>
