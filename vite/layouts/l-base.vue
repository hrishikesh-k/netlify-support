<script setup lang="ts">
  import CLoadingIndicator from '~/client/components/c-loading-indicator.vue'
  import {componentLoading, nfUser, redirectTo, wretchBase, zdUser} from '~/client/utils/constants.ts'
  import {computed, onMounted, ref} from 'vue'
  import PVProgressBar from 'primevue/progressbar'
  import {useDark} from '@vueuse/core'
  import {useRoute, useRouter} from 'vue-router'
  import type {TRouteUserInfoRes} from '~/types/response.ts'
  import {WretchError} from 'wretch/resolver'
  const route = useRoute()
  const router = useRouter()
  const routerReady = ref<boolean>(false)
  const showRouterView = computed<boolean>(() => {
    return routerReady.value && (nfUser.value !== null || route.path === '/login')
  })
  onMounted(async () => {
    await router.isReady()
    routerReady.value = true
    redirectTo.value = {
      name: route.name,
      path: route.path
    }
    try {
      const userRes = await wretchBase.get('/user/info').json<TRouteUserInfoRes>()
      nfUser.value = userRes.nf
      zdUser.value = userRes.zd
      if (redirectTo.value && redirectTo.value.path !== '/' && router.hasRoute(redirectTo.value.name || '')) {
        await router.replace(redirectTo.value.path)
      } else {
        await router.replace('/dashboard')
      }
    } catch (userErr) {
      if (userErr instanceof WretchError && (userErr.status === 401 || userErr.status === 403)) {
        await router.replace('/login')
      } else {
        // TODO: handle error
      }
    }
  })
  useDark({
    storageKey: 'nf_theme'
  })
</script>
<template>
  <PVProgressBar
    mode="indeterminate"
    v-bind:pt="{
      root: 'h-1 left-0 pos-fixed top-0 w-full',
      value: 'after-animate-delay-1250 after:animate-duration-2000 before:animate-duration-2000 after:animate-iteration-count-infinite before:animate-iteration-count-infinite after:animate-name-pv-progress-bar-indeterminate-value-after before:animate-name-pv-progress-bar-indeterminate-value-before dark:after:bg-teal-400 dark:before:bg-teal-400 after:content-empty before:content-empty h-1 after:h-1 before:h-1 after:left-0 before:left-0 after:pos-absolute before:pos-absolute after:top-0 before:top-0'
    }"
    v-if="componentLoading"/>
  <div class="flex flex-col h-full">
    <RouterView v-if="showRouterView"/>
    <div class="flex flex-1 h-full items-center justify-center w-full" v-else>
      <CLoadingIndicator v-bind:size="35"/>
    </div>
  </div>
</template>
<style>
  @font-face {
    font-display: swap;
    font-family: 'Mulish';
    font-style: italic;
    font-weight: 200 1000;
    src: url('/fonts/mulish-italic-latin.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-display: swap;
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 200 1000;
    src: url('/fonts/mulish-normal-latin.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @keyframes pv-progress-bar-indeterminate-value-after {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
  @keyframes pv-progress-bar-indeterminate-value-before {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }
</style>