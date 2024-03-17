<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import type {CIconProps} from '~/types/props.ts'
  import {computed, type LinkHTMLAttributes, ref} from 'vue'
  import CProgressSpinner from '~/client/components/c-progress-spinner.vue'
  import {nfUser, wretchBase} from '~/client/utils/constants.ts'
  import PVAvatar, {type AvatarProps} from 'primevue/avatar'
  import PVBreadcrumb, {type BreadcrumbProps} from 'primevue/breadcrumb'
  import PVButton, {type ButtonProps} from 'primevue/button'
  import PVInlineMessage, {type InlineMessagePassThroughOptions, type InlineMessageProps} from 'primevue/inlinemessage'
  import PVMenu, {type MenuProps} from 'primevue/menu'
  import PVToolbar, {type ToolbarProps} from 'primevue/toolbar'
  import type {TRouteSystemStatusRes} from '~/types/response.ts'
  import type {TSStatus} from '~/types/global.ts'
  import {type RouteLocationNormalizedLoaded, type RouteRecordNormalized, useRoute, useRouter} from 'vue-router'
  import {useTimeoutPoll} from '@vueuse/core'
  interface SystemStatusIndicator {
    component : {
      name : 'a' | 'div' | typeof PVButton
      on? : {
        click? : () => void
      }
      props? : ButtonProps | (LinkHTMLAttributes & {
        target : '_blank'
      })
    }
    icon : CIconProps
    label : 'Loading...' | 'Retry' | TSStatus['status']['description']
    props : {
      pt : {
        root : InlineMessagePassThroughOptions['root']
        text : InlineMessagePassThroughOptions['text']
      },
      severity : InlineMessageProps['severity']
    }
  }
  const pvAvatarProps : AvatarProps = {
    image: nfUser.value!.avatar_url,
    pt: {
      image: 'border-rounded-full h-full w-full',
      root: 'h-10 w-10'
    }
  }
  const pvBreadcrumbProps = computed<BreadcrumbProps>(() => {
    const currentBreadcrumbLevelMinusOne = route.meta.breadcrumb.level -1
    const pvBreadcrumbItems : BreadcrumbProps['model'] = []
    function formatLabel(route : RouteLocationNormalizedLoaded | RouteRecordNormalized) {
      const label = route.meta.breadcrumb.label
      const labelRegex = /[[a-z.]*]/
      const labelSquareBrackets = label.match(labelRegex)
      if (labelSquareBrackets) {
        // @ts-ignore
       return label.replace(labelRegex, labelSquareBrackets[0].replaceAll(/[\[\]]/g, '').split('.').reduce((prev, curr) => {
         if (prev) {
           // @ts-ignore
           return prev[curr]
         } else {
           return null
         }
       }, route))
      } else {
        return label
      }
    }
    pvBreadcrumbItems[currentBreadcrumbLevelMinusOne] = {
      label: formatLabel(route),
      route: route.path
    }
    for (let i = currentBreadcrumbLevelMinusOne; i > 0; i--) {
      const parent = router.getRoutes().find(routeToCheck => {
        return routeToCheck.name === route.meta.breadcrumb.parent
      })
      if (parent) {
        pvBreadcrumbItems[i - 1] = {
          label: formatLabel(parent),
          route: parent.path
        }
      }
    }
    return {
      home: {
        route: '/'
      },
      model: pvBreadcrumbItems,
      pt: {
        menu: 'flex sm:gap-x-2 items-center list-none m-0 p-0'
      }
    }
  })
  const pvButtonAvatarProps : ButtonProps = {
    'aria-controls': 'user-menu',
    'aria-haspopup': true,
    pt: {
      root: 'bg-transparent border-0 border-rounded-full cursor-pointer p-0 ring-offset-1 dark:ring-offset-neutral-dark-800 dark:ring-teal-100 hover:ring-2 transition-duration-250'
    }
  }
  const pvButtonLogoutProps : ButtonProps = {
    label: 'Logout',
    pt: {
      root: 'bg-transparent dark:hover:bg-red-900 border-0 border-rounded-b-2 box-border cursor-pointer flex font-inherit font-500 gap-x-2 items-center p-x-4 p-y-2 text-inherit dark:hover:text-red-200 text-4 text-left transition-duration-250 w-full'
    }
  }
  const pvMenuProps : MenuProps = {
    model: [{
      separator: true
    }, {
      icon: 'plus',
      label: 'New ticket',
      route: '/tickets/new'
    }, {
      icon: 'messages',
      label: 'My tickets',
      route: '/tickets'
    }, {
      separator: true
    }],
    popup: true,
    pt: {
      menu: 'list-none m-0 p-0 outline-0',
      menuitem: 'dark:hover:bg-neutral-dark-600 transition-duration-250 w-full',
      root:  {
        class: 'dark:bg-neutral-dark-700 border-rounded-2',
        style: {
          'margin-top': '0.125rem'
        }
      },
      separator: 'border-0 border-solid border-t-1 dark:border-neutral-dark-400 m-x-2',
      start: 'box-border p-x-4 p-y-2'
    }
  }
  const pvToolbarProps : ToolbarProps = {
    pt: {
      end: 'flex gap-x-3 items-center',
      root: 'flex items-center justify-between',
    }
  }
  const route = useRoute()
  const router = useRouter()
  const systemStatus = ref<'error' | null | TSStatus>(null)
  const systemStatusIndicator = computed<SystemStatusIndicator>(() => {
    const pt : SystemStatusIndicator['props']['pt'] = {
      root: 'border-1 border-rounded-1.5 border-solid box-border flex gap-x-1 items-center lt-sm:max-w-30 p-x-2 p-y-1 text-3 transition-duration-250 ',
      text: 'text-truncate'
    }
    let componentName : SystemStatusIndicator['component']['name'] = 'div'
    let componentOn : SystemStatusIndicator['component']['on'] = {}
    let componentProps : SystemStatusIndicator['component']['props'] = {}
    let iconName : CIconProps['name'] = 'circle'
    let iconSize : CIconProps['size'] = 2
    let label : SystemStatusIndicator['label'] = 'Loading...'
    let severity : SystemStatusIndicator['props']['severity'] = 'secondary'
    if (systemStatus.value === 'error') {
      componentName = PVButton
      componentOn = {
        click: fetchSystemStatus
      }
      componentProps = {
        pt: {
          root: 'bg-transparent border-0 cursor-pointer p-0 text-inherit transition-duration-250 '
        }
      }
      iconName = 'rotate-right'
      iconSize = 3
      label = 'Retry'
      pt.root += 'dark:bg-purple-900 dark:hover:bg-purple-800 dark:border-purple-500 dark:text-purple-200'
    } else if (systemStatus.value) {
      componentName = 'a'
      componentProps = {
        class: 'decoration-none',
        href: systemStatus.value.page.url,
        rel: 'nofollow noopener noreferrer',
        target: '_blank'
      }
      iconName = 'circle'
      iconSize = 2
      label = systemStatus.value.status.description
      switch (systemStatus.value.status.indicator) {
        case 'critical':
        case 'major':
          pt.root += 'dark:bg-red-900 dark:hover:bg-red-800 dark:border-red-500 dark:text-red-200'
          severity = 'error'
          break
        case 'maintenance':
          pt.root += 'dark:bg-blue-900 dark:hover:bg-blue-800 dark:border-blue-500 dark:text-blue-200'
          severity = 'info'
          break
        case 'minor':
          pt.root += 'dark:bg-gold-900 dark:hover:bg-gold-800 dark:border-gold-500 dark:text-gold-200'
          severity = 'warn'
          break
        case 'none':
          pt.root += 'dark:bg-green-900 dark:hover:bg-green-800 dark:border-green-500 dark:text-green-200'
          severity = 'success'
          break
      }
    } else {
      pt.root += 'dark:bg-neutral-dark-700 dark:border-neutral-dark-500 cursor-wait dark:text-neutral-dark-200'
    }
    return {
      component: {
        name: componentName,
        on: componentOn,
        props: componentProps
      },
      icon: {
        name: iconName,
        size: iconSize
      },
      label,
      props: {
        pt,
        severity
      }
    }
  })
  const userMenuElement = ref<null | PVMenu>(null)
  async function fetchSystemStatus() {
    try {
      systemStatus.value = null
      systemStatus.value = await wretchBase.get('/system/status').json<TRouteSystemStatusRes>()
    } catch {
      // TODO: handle error
      systemStatus.value = 'error'
    }
  }
  function userMenuToggle(event : Event) {
    if (userMenuElement.value) {
      userMenuElement.value.toggle(event)
    }
  }
  useTimeoutPoll(fetchSystemStatus, 5 * 60 * 1000, {
    immediate: true
  })
</script>
<template>
  <header class="dark:bg-neutral-dark-800 border-1 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border m-b-6 p-3 w-full">
    <PVToolbar v-bind="pvToolbarProps">
      <template v-slot:start>
        <PVBreadcrumb v-bind="pvBreadcrumbProps">
          <template v-slot:item="pvBreadcrumbItem">
            <RouterLink class="dark:hover:bg-teal-900 block border-rounded-1.5 box-border p-1 transition-duration-250" to="/" v-if="pvBreadcrumbItem.item.route === '/'">
              <svg class="block h-8 w-8" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path class="fill-teal-800 dark:fill-neutral-000 dark-group-hover:fill-teal-800 group-hover:fill-neutral-000 transition-duration-250" d="m30.17,30.86h-3.29l-.27-.27v-7.7c0-1.37-.54-2.43-2.19-2.47-.85-.02-1.82,0-2.86.04l-.16.16v9.97l-.27.27h-3.29l-.27-.27v-13.16l.27-.27h7.41c2.88,0,5.21,2.33,5.21,5.21v8.23l-.27.27Z"/>
                <path class="fill-teal-400 dark:fill-teal-200 dark:group-hover:fill-teal-400 group-hover:fill-teal-200 transition-duration-250" d="m21.97,46.78v-10.93l.29-.29h3.48l.29.29v10.93l-.29.29h-3.48l-.29-.29Zm0-34.63V1.22l.29-.29h3.48l.29.29v10.93l-.29.29h-3.48l-.29-.29Zm-9.19,26.53h-.48l-2.39-2.39v-.48l3.18-3.19h2.53s.34.34.34.34v2.53l-3.18,3.19Zm-2.87-26.37v-.48l2.39-2.39h.48l3.19,3.19v2.53l-.34.34h-2.53l-3.19-3.19ZM.29,21.97h12.3l.29.29v3.48l-.29.29H.29L0,25.74v-3.48l.29-.29Zm47.42,4.07h-12.3l-.29-.29v-3.48l.29-.29h12.3l.29.29v3.48l-.29.29Z"/>
              </svg>
            </RouterLink>
            <RouterLink class="dark:hover:bg-teal-900 sm:block border-rounded-1.5 decoration-none font-600 hidden p-2 text-inherit dark:hover:text-teal-100 transition-duration-250" v-bind:to="pvBreadcrumbItem.item.route" v-else>{{pvBreadcrumbItem.label}}</RouterLink>
          </template>
          <template v-slot:separator>
            <span class="font-200 sm:block hidden text-neutral-dark-300 text-5">/</span>
          </template>
        </PVBreadcrumb>
      </template>
      <template v-slot:end>
        <component v-bind="systemStatusIndicator.component.props" v-bind:is="systemStatusIndicator.component.name" v-on="systemStatusIndicator.component.on">
          <PVInlineMessage v-bind="systemStatusIndicator.props">
            <template v-slot:icon>
              <CIcon class="flex-shrink-0" v-bind="systemStatusIndicator.icon" v-if="systemStatus"/>
              <CProgressSpinner v-bind:size="3" v-else/>
            </template>{{systemStatusIndicator.label}}</PVInlineMessage>
        </component>
        <template v-if="nfUser">
          <PVButton v-bind="pvButtonAvatarProps" v-on:click="userMenuToggle">
            <PVAvatar v-bind="pvAvatarProps"/>
          </PVButton>
          <PVMenu id="user-menu" ref="userMenuElement" v-bind="pvMenuProps">
            <!-- TODO: handle transition -->
            <template v-slot:end>
              <a class="decoration-none text-inherit" href="/api/auth/logout">
                <PVButton v-bind="pvButtonLogoutProps">
                  <template v-slot:icon>
                    <CIcon name="right-from-bracket"/>
                  </template>
                </PVButton>
              </a>
            </template>
            <template v-slot:item="pvMenuItem">
              <RouterLink class="box-border decoration-none flex gap-x-2 items-center p-x-4 p-y-2 text-inherit" v-bind:to="pvMenuItem.item.route" v-if="pvMenuItem.item.route">
                <CIcon v-bind:name="pvMenuItem.item.icon as CIconProps['name']"/>
                <span>{{pvMenuItem.label}}</span>
              </RouterLink>
              <hr v-if="pvMenuItem.item.separator"/>
            </template>
            <template v-slot:start>
              <p class="font-500 m-0">{{nfUser.full_name}}</p>
              <p class="m-0 text-3.5 dark:text-neutral-dark-200">{{nfUser.email}}</p>
            </template>
          </PVMenu>
        </template>
        <CProgressSpinner class="dark:text-teal-400" v-bind:size="10" v-else/>
      </template>
    </PVToolbar>
  </header>
</template>