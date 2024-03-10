<script setup lang="ts">
  import CIcon from '~/client/components/c-icon/c-icon.vue'
  import type {CIconProps} from '~/client/components/c-icon/c-icon.ts'
  import {computed, ref} from 'vue'
  import {nfUser} from '~/client/utils/constants.ts'
  import PVAvatar from 'primevue/avatar'
  import PVBreadcrumb, {type BreadcrumbProps} from 'primevue/breadcrumb'
  import PVButton from 'primevue/button'
  import PVMenu from 'primevue/menu'
  import PVProgressSpinner from 'primevue/progressspinner'
  import {useRoute} from 'vue-router'
  const breadcrumbItems = computed<BreadcrumbProps['model']>(() => {
    if (route.name === '/') {
      // TODO: dynamically generate breadcrumbs
    }
    return []
  })
  const route = useRoute()
  const userMenuElement = ref<null | PVMenu>(null)
  function userMenuToggle(event : Event) {
    if (userMenuElement.value) {
      userMenuElement.value.toggle(event)
    }
  }
</script>
<template>
  <header class="dark:bg-neutral-dark-800 border-rounded-2 box-border flex items-center justify-between p-3 w-full">
    <PVBreadcrumb
      v-bind:home="{
        route: '/dashboard'
      }"
      v-bind:model="breadcrumbItems"
      v-bind:pt="{
        menu: 'list-none m-0 p-0'
      }">
      <template v-slot:item="pvBreadcrumbItem">
        <RouterLink class="dark:hover:bg-teal-900 block border-rounded-1.5 box-border p-1" to="/dashboard" v-if="pvBreadcrumbItem.item.route">
          <svg class="block h-8 w-8" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-teal-800 dark:fill-neutral-000 dark-group-hover:fill-teal-800 group-hover:fill-neutral-000 transition-duration-250" d="m30.17,30.86h-3.29l-.27-.27v-7.7c0-1.37-.54-2.43-2.19-2.47-.85-.02-1.82,0-2.86.04l-.16.16v9.97l-.27.27h-3.29l-.27-.27v-13.16l.27-.27h7.41c2.88,0,5.21,2.33,5.21,5.21v8.23l-.27.27Z"/>
            <path class="fill-teal-400 dark:fill-teal-200 dark:group-hover:fill-teal-400 group-hover:fill-teal-200 transition-duration-250" d="m21.97,46.78v-10.93l.29-.29h3.48l.29.29v10.93l-.29.29h-3.48l-.29-.29Zm0-34.63V1.22l.29-.29h3.48l.29.29v10.93l-.29.29h-3.48l-.29-.29Zm-9.19,26.53h-.48l-2.39-2.39v-.48l3.18-3.19h2.53s.34.34.34.34v2.53l-3.18,3.19Zm-2.87-26.37v-.48l2.39-2.39h.48l3.19,3.19v2.53l-.34.34h-2.53l-3.19-3.19ZM.29,21.97h12.3l.29.29v3.48l-.29.29H.29L0,25.74v-3.48l.29-.29Zm47.42,4.07h-12.3l-.29-.29v-3.48l.29-.29h12.3l.29.29v3.48l-.29.29Z"/>
          </svg>
        </RouterLink>
      </template>
    </PVBreadcrumb>
    <template v-if="nfUser">
      <PVButton
        aria-controls="user-menu"
        aria-haspopup="true"
        v-bind:pt="{
          root: 'bg-transparent border-0 border-rounded-full cursor-pointer p-0 ring-offset-1 dark:ring-offset-neutral-dark-800 dark:ring-teal-100 hover:ring-2'
        }"
        v-on:click="userMenuToggle">
        <PVAvatar
          v-bind:image="nfUser.avatar_url"
          v-bind:pt="{
            image: 'border-rounded-full h-full w-full',
            root: 'h-10 w-10'
          }"/>
      </PVButton>
      <PVMenu
        popup
        id="user-menu"
        ref="userMenuElement"
        v-bind:model="[{
          separator: true
        }, {
          icon: 'message-plus',
          label: 'New ticket',
          route: '/tickets'
        }, {
          icon: 'messages',
          label: 'My tickets',
          route: '/tickets'
        }, {
          separator: true
        }]"
        v-bind:pt="{
          menu: 'list-none m-0 p-0 outline-0',
          menuitem: 'dark:hover:bg-neutral-dark-600 transition-duration-250 w-full',
          root: () => {
            return {
              class: 'dark:bg-neutral-dark-700 border-rounded-2',
              style: {
                'margin-top': '0.125rem'
              }
            }
          },
          separator: 'border-0 border-solid border-t-1 dark:border-neutral-dark-400 m-x-2',
          start: 'box-border p-x-4 p-y-2'
        }">
        <template v-slot:end>
          <a class="decoration-none text-inherit" href="/api/auth/logout">
            <PVButton
              label="Logout"
              v-bind:pt="{
                root: 'bg-transparent dark:hover:bg-red-900 border-0 border-rounded-b-2 box-border cursor-pointer flex font-inherit font-500 gap-x-2 items-center p-x-4 p-y-2 text-inherit dark:hover:text-red-200 text-4 text-left transition-duration-250 w-full'
              }">
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
    <PVProgressSpinner
      v-bind:pt="{
        circle: () => {
          return {
            class: 'animate-duration-1500 animate-iteration-count-infinite animate-name-pv-progress-spinner-dash dark:stroke-teal-400',
            style: {
              'stroke-dasharray': '89, 200',
              'stroke-dashoffset': '0'
            }
          }
        },
        root: 'h-10 w-10',
        spinner: 'animate-spin'
      }"
      v-else/>
  </header>
</template>
<style>
  @keyframes pv-progress-spinner-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>