import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
// import router from './router'
const routes = [
    {Path:"/home", components:"HomePage"}
]
const router = createRouter({history: createWebHistory(), routes})
// const app = createApp(App)

createApp(App).use(createPinia())
// app.use(router)

createApp(App).use(router).mount('#app')
