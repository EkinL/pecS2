<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="toast.show"
      class="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircle v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" />
            <XCircle v-else-if="toast.type === 'error'" class="h-6 w-6 text-red-400" />
            <AlertCircle v-else-if="toast.type === 'warning'" class="h-6 w-6 text-yellow-400" />
            <Info v-else class="h-6 w-6 text-blue-400" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="hideToast"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'

export default {
  name: 'Toast',
  components: {
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    X
  },
  computed: {
    ...mapState('ui', ['toast'])
  },
  methods: {
    ...mapActions('ui', ['hideToast'])
  }
}
</script>
