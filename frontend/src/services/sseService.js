import store from '../store'

const sseService = {
  eventSource: null,

  connect() {
    if (this.eventSource) return
    this.eventSource = new EventSource('http://localhost:3001/sse/payments')
    this.eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        store.commit('payments/SET_PAYMENT_STATUS', data)
      } catch (err) {
        console.error('[SSE] Invalid message', err)
      }
    }
    this.eventSource.onerror = (err) => {
      console.error('[SSE] Connection error', err)
    }
  },

  close() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  },
}

export default sseService