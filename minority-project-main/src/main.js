import './assets/base.css'
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 添加FontAwesome图标
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
