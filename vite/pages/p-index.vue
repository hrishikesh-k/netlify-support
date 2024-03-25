<script setup lang="ts">
  import CFooter from '~/client/components/c-footer.vue'
  import CHeader from '~/client/components/c-header.vue'
  import {nfUser} from '~/client/utils/constants.ts'
  import {useRoute, useRouter} from 'vue-router'
  import {watch} from 'vue'
  const route = useRoute()
  const router = useRouter()
  watch(() => {
    return route.path
  }, async () => {
    if (route.path === '/' && nfUser.value) {
      await router.replace('/dashboard')
    }
  })
</script>
<template>
  <div class="box-border m-x-auto max-w-350 p-6 w-full">
    <CHeader/>
    <main class="m-b-6 m-t-22.5">
      <RouterView/>
    </main>
    <CFooter/>
  </div>
</template>