<template>
  <div class="w-full">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'BarChart',
  props: {
    data: { type: Array, required: true },
    labels: { type: Array, required: true }
  },
  mounted() {
    this.createChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  watch: {
    data() {
      this.updateChart()
    },
    labels() {
      this.updateChart()
    }
  },
  methods: {
    createChart() {
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
    },
    updateChart() {
      if (!this.chart) {
        this.createChart()
        return
      }
      this.chart.data.labels = this.labels
      this.chart.data.datasets[0].data = this.data
      this.chart.update()
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
