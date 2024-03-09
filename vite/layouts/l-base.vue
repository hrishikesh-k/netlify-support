<script setup lang="ts">
  import {onMounted, ref} from 'vue'
  import {nfUser, redirectTo, wretchBase} from '~/client/utils/constants.ts'
  import type {TRouteUserInfoRes} from '~/types/response.ts'
  import {useDark} from '@vueuse/core'
  import {useRoute, useRouter} from 'vue-router'
  import {WretchError} from 'wretch/resolver'
  import CLoadingIndicator from "~/client/components/c-loading-indicator/c-loading-indicator.vue";
  const route = useRoute()
  const router = useRouter()
  const userLoadAttempted = ref<boolean>(false)
  onMounted(async () => {
    if (!route.meta.skipAuth) {
      redirectTo.value = {
        name: route.name,
        path: route.path
      }
    }
    try {
      const userRes = await wretchBase.get('/user/info').json<TRouteUserInfoRes>()
      nfUser.value = userRes.nf
      if (redirectTo.value && router.hasRoute(redirectTo.value.name || '')) {
        await router.push(redirectTo.value.path)
      } else {
        await router.push('/dashboard')
      }
    } catch (userErr) {
      if (userErr instanceof WretchError && (userErr.status === 401 || userErr.status === 403)) {
        await router.replace('/login')
      } else {
        // TODO: handle error
      }
    } finally {
      userLoadAttempted.value = true
    }
  })
  useDark({
    storageKey: 'nf_theme'
  })
</script>
<template>
  <RouterView v-if="userLoadAttempted"/>
  <div class="flex h-full items-center justify-center w-full" v-else>
    <div class="h-40 w-40">
      <CLoadingIndicator/>
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
</style>