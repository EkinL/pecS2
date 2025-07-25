import store from '../store'

const statsSseService = {
  eventSource: null,

  connect() {
    if (this.eventSource) return
    this.eventSource = new EventSource('https://pecapi.lilianhammache.com/sse/stats')
    this.eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        store.commit('admin/SET_STATS', data)
      } catch (err) {
        console.error('[SSE] Invalid stats message', err)
      }
    }
    this.eventSource.onerror = (err) => {
      console.error('[SSE] Stats connection error', err)
    }
  },

  close() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  },
}

export default statsSseService
