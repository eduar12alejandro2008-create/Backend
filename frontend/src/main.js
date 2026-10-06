import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: { Notify, Dialog, Loading },
  config: {
    notify: {
      position: 'top',
      timeout: 2500,
      classes: 'text-weight-medium'
    },
    loading: { spinnerSize: '4em' }
  }
})

app.mount('#app')
