import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import OfferPage from './components/OfferPage.vue'

import App from './App.vue'
// import router from './router'
const routes = [
    {path:"/", component:HomePage},
    {path:"/offers", component:OfferPage}
]
const router = createRouter({history: createWebHistory(), routes})


createApp(App).use(router).mount('#app')
