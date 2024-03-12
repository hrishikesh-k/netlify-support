<script setup lang="ts">
  import CHeader from '~/client/components/c-header.vue'
  import {useRoute} from 'vue-router'
  const route = useRoute()
</script>
<template>
  <RouterView v-if="route.path === '/login'"/>
  <div class="box-border m-x-auto max-w-350 p-6 w-full" v-else>
    <CHeader/>
    <RouterView/>
  </div>
</template>