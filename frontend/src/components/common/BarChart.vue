<template>
  <div class="w-full">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default {
  name: 'BarChart',
  props: {
    data: { type: Array, required: true },
    labels: { type: Array, required: true }
  },
  mounted() {
    this.renderChart()
  },
  watch: {
    data() {
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy()
      }
      this.chart = new Chart(this.$refs.canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Total',
              data: this.data,
              backgroundColor: '#3b82f6'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 200px !important;
}
</style>
