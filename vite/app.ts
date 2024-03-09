import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import LBase from '~/client/layouts/l-base.vue'
import {nfUser} from '~/client/utils/constants.ts'
import primeVue from 'primevue/config'
import 'virtual:uno.css'
const app = createApp(LBase).use(primeVue, {
  unstyled: true
})
const router = createRouter({
  history: createWebHistory(),
  routes: [{
    component: () => {
      return import('~/client/pages/p-dashboard.vue')
    },
    name: 'p-dashboard',
    path: '/dashboard'
  }, {
    component: () => {
      return import('~/client/pages/p-index.vue')
    },
    meta: {
      skipAuth: true
    },
    name: 'p-index',
    path: '/'
  }, {
    beforeEnter: () => {
      if (nfUser.value) {
        return false
      }
    },
    component: () => {
      return import('~/client/pages/p-login.vue')
    },
    meta: {
      skipAuth: true
    },
    name: 'p-login',
    path: '/login'
  }]
})
app.use(router)
await router.isReady()
app.mount('#n-wrapper')