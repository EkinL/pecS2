<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Comptes marchands"
          :value="merchants.length"
          icon="Users"
          color="purple"
        />
        <StatsCard title="Transactions" :value="payments.length" icon="CreditCard" color="blue" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StatsCard from '../../components/common/StatsCard.vue'

export default {
  name: 'AdminDashboard',
  components: { StatsCard },
  computed: {
    ...mapGetters('admin', ['merchants', 'payments']),
  },
  async created() {
    await Promise.all([this.fetchMerchants(), this.fetchPayments()])
  },
  methods: {
    ...mapActions('admin', ['fetchMerchants', 'fetchPayments']),
  },
}
</script>
