<template>
  <div class="w-full h-48 flex items-end space-x-4">
    <div
      v-for="(v, i) in data"
      :key="i"
      class="flex-1 flex flex-col items-center"
    >
      <div
        class="w-full bg-blue-500 rounded-t"
        :style="{ height: ((v / max) * 100) + '%' }"
      ></div>
      <span class="mt-1 text-xs text-gray-600">{{ labels[i] }}</span>
      <span class="text-xs font-semibold">{{ v }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    data: { type: Array, required: true },
    labels: { type: Array, required: true },
  },
  computed: {
    max() {
      return Math.max(...this.data, 1)
    },
  },
}
</script>
