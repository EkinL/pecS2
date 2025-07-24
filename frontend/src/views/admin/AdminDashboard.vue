<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Comptes marchands"
          :value="stats.totalMerchants ?? 0"
          icon="Users"
          color="purple"
        />
        <StatsCard
          title="Comptes clients"
          :value="stats.totalClients ?? 0"
          icon="Users"
          color="green"
        />
        <StatsCard title="Transactions" :value="stats.totalTransactions ?? 0" icon="CreditCard" color="blue" />
        <StatsCard title="Revenus" :value="`${stats.totalAmount?.toFixed(2) || 0}€`" icon="DollarSign" color="yellow" />
      </div>

      <div class="mt-8 h-64">
        <BarChart :data="chartData" :labels="['Marchands','Clients','Transactions']" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StatsCard from '../../components/common/StatsCard.vue'
import BarChart from '../../components/common/BarChart.vue'

export default {
  name: 'AdminDashboard',
  components: { StatsCard, BarChart },
  computed: {
    ...mapGetters('admin', ['merchants', 'payments', 'stats']),
    chartData() {
      return [this.stats.totalMerchants || 0, this.stats.totalClients || 0, this.stats.totalTransactions || 0]
    },
  },
  async created() {
    await Promise.all([this.fetchMerchants(), this.fetchPayments(), this.fetchStats()])
  },
  methods: {
    ...mapActions('admin', ['fetchMerchants', 'fetchPayments', 'fetchStats']),
  },
}
</script>
