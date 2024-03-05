<script setup lang="ts">
  import {onMounted} from 'vue'
  import {nfUser, redirect_to, wretchBase} from '~/client/utils/constants.ts'
  import type {TRouteUserInfoRes} from '~/types/response.ts'
  import {useDark} from '@vueuse/core'
  import {useRoute, useRouter} from 'vue-router'
  import {WretchError} from 'wretch/resolver'
  const route = useRoute()
  const router = useRouter()
  onMounted(async () => {
    if (route.query['csrf'] && route.query['csrf'] !== localStorage.getItem('nf_csrf') ) {
      location.href = '/api/auth/logout'
    }
    if (!route.meta.skipAuth) {
      redirect_to.value = {
        name: route.name,
        path: route.path
      }
      await router.push('/')
    }
    try {
      const userRes = await wretchBase.get('/user/info').json<TRouteUserInfoRes>()
      nfUser.value = userRes.nf
      if (redirect_to.value && router.hasRoute(redirect_to.value.name || '')) {
        await router.push(redirect_to.value.path)
      } else {
        await router.push('/dashboard')
      }
    } catch (userErr) {
      if (userErr instanceof WretchError && userErr.status === 401) {
        await router.push('/login')
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
  <RouterView/>
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