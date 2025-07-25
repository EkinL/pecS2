import store from '../store'

const activitySseService = {
  eventSource: null,

  connect() {
    if (this.eventSource) return
    this.eventSource = new EventSource('http://85.31.236.64:3001/sse/activity')
    this.eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (Array.isArray(data)) {
          store.commit('admin/SET_ACTIVITIES', data)
        } else {
          store.commit('admin/ADD_ACTIVITY', data)
        }
      } catch (err) {
        console.error('[SSE] Invalid activity message', err)
      }
    }
    this.eventSource.onerror = (err) => {
      console.error('[SSE] Activity connection error', err)
    }
  },

  close() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  },
}

export default activitySseService
