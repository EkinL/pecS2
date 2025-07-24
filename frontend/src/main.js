import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./style.css"

// Configuration globale de l'application
const app = createApp(App)

// Configuration des propriétés globales
app.config.globalProperties.$filters = {
  currency(value) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  },
  date(value) {
    return new Date(value).toLocaleDateString("fr-FR")
  },
}

// Gestion des erreurs globales
app.config.errorHandler = (err, vm, info) => {
  console.error("Erreur globale:", err, info)
  // Ici vous pourriez envoyer l'erreur à un service de monitoring
}

// Installation des plugins
app.use(store)
app.use(router)

// Montage de l'application
app.mount("#app")

// Hot Module Replacement (HMR) pour le développement
if (import.meta.hot) {
  import.meta.hot.accept()
}
