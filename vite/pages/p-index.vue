<script setup lang="ts">
  import {nfUser, redirectTo, wretchBase} from '~/client/utils/constants.ts'
  import {onMounted} from 'vue'
  import type {TRouteUserInfoRes} from '~/types/response.ts'
  import {useRouter} from 'vue-router'
  import {WretchError} from 'wretch/resolver'
  const router = useRouter()
  onMounted(async () => {
    try {
      const userRes = await wretchBase.get('/user/info').json<TRouteUserInfoRes>()
      nfUser.value = userRes.nf
      if (redirectTo.value && router.hasRoute(redirectTo.value.name || '')) {
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
</script>
<template>
  <RouterView/>
</template>