<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component :is="iconComponent" :class="`h-6 w-6 text-${color}-400`" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">{{ title }}</dt>
            <dd class="text-lg font-medium text-gray-900">{{ value }}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CreditCard, DollarSign, TrendingUp, ShoppingCart } from 'lucide-vue-next'

export default {
  name: 'StatsCard',
  components: {
    CreditCard,
    DollarSign,
    TrendingUp,
    ShoppingCart
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'gray'
    }
  },
  computed: {
    iconComponent() {
      const icons = {
        CreditCard,
        DollarSign,
        TrendingUp,
        ShoppingCart
      }
      return icons[this.icon] || CreditCard
    }
  }
}
</script>
