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
      meta: {
        breadcrumb: {
          label: 'Dashboard',
          level: 1,
          parent: 'p-index'
        }
      },
      name: 'p-dashboard',
      path: '/dashboard'
    }, {
      children: [{
        component: () => {
          return import('~/client/pages/p-tickets.vue')
        },
        meta: {
          breadcrumb: {
            label: 'New',
            level: 2,
            parent: 'p-tickets'
          }
        },
        name: 'p-tickets-new',
        path: '/tickets/new'
      }, {
        component: () => {
          return import('~/client/pages/p-tickets-view.vue')
        },
        meta: {
          breadcrumb: {
            label: '#[params.id]',
            level: 2,
            parent: 'p-tickets'
          }
        },
        name: 'p-tickets-view',
        path: '/tickets/:id(\\d+)'
      }],
      component: () => {
        return import('~/client/pages/p-tickets.vue')
      },
      meta: {
        breadcrumb: {
          label: 'Tickets',
          level: 1,
          parent: 'p-index'
        }
      },
      name: 'p-tickets',
      path: '/tickets'
    }],
    component: () => {
      return import('~/client/pages/p-index.vue')
    },
    meta: {
      breadcrumb: {
        label: 'Index',
        level: 0,
        parent: null
      }
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
  if (to.matched.some(matchedTo => {
    return matchedTo.components && typeof matchedTo.components.default === 'function'
  })) {
    componentLoading.value = true
  }
})
router.beforeResolve(() => {
  componentLoading.value = false
})
createApp(LBase).use(primeVue, {
  unstyled: true
}).use(router).mount('#n-wrapper')