import {componentLoading} from '~/client/utils/constants.ts'
import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import LBase from '~/client/layouts/l-base.vue'
import primeVue from 'primevue/config'
import 'virtual:uno.css'
const router = createRouter({
  history: createWebHistory(),
  routes: [{
    children: [{
      component: () => {
        return import('~/client/pages/p-dashboard.vue')
      },
      name: 'p-dashboard',
      path: '/dashboard'
    }],
    component: () => {
      return import('~/client/pages/p-index.vue')
    },
    name: 'p-index',
    path: '/'
  }, {
    component: () => {
      return import('~/client/pages/p-login.vue')
    },
    name: 'p-login',
    path: '/login'
  }]
})
router.beforeEach(to => {
  if (to.matched[0].components && typeof to.matched[0].components.default === 'function') {
    componentLoading.value = true
  }
})
router.beforeResolve(() => {
  componentLoading.value = false
})
createApp(LBase).use(primeVue, {
  unstyled: true
}).use(router).mount('#n-wrapper')