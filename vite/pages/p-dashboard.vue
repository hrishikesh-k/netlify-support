<script setup lang="ts">
  import CIcon from '~/client/components/c-icon/c-icon.vue'
  import type {CIconProps} from '~/client/components/c-icon/c-icon.ts'
  import {nfUser} from '~/client/utils/constants.ts'
  import PVAvatar from 'primevue/avatar'
  import PVButton from 'primevue/button'
  import PVMenu, {type MenuProps} from 'primevue/menu'
  import {ref} from 'vue'
  const userMenuElement = ref<null | PVMenu>(null)
  const userMenuItems : MenuProps['model'] = [{
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
  }]
  function userMenuToggle(event : Event) {
    if (userMenuElement.value) {
      userMenuElement.value.toggle(event)
    }
  }
</script>
<template>
  <div class="w-full" v-if="nfUser">
    <PVMenu popup class="" ref="userMenuElement" v-bind:model="userMenuItems" v-bind:pt="{
      menu: 'list-none m-0 p-0 outline-0',
      menuitem: 'dark:hover:bg-neutral-dark-600 transition-duration-250 w-full',
      root: 'dark:bg-neutral-dark-700 border-rounded-2',
      separator: 'border-0 border-solid border-t-1 dark:border-neutral-dark-400 m-x-2',
      start: 'box-border p-x-4 p-y-2'
    }">
      <template v-slot:end>
        <a class="decoration-none text-inherit" href="/api/auth/logout">
          <PVButton label="Logout" v-bind:pt="{
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
    <PVAvatar
      v-bind:image="nfUser.avatar_url"
      v-bind:pt="{
        image: 'border-rounded-full h-full w-full',
        root: 'h-10 w-10'
      }"
      v-on:click="userMenuToggle"/>
  </div>
  <div v-else>
    <!-- TODO: show fatal error -->
  </div>
</template>