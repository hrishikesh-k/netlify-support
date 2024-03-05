<script setup lang="ts">
  import type {Story, Variant} from 'histoire'
  // @ts-ignore
  const props = defineProps<{
    story : Story
    variant? : Variant
  }>()
</script>
<template>
  <div id="n-wrapper">
    <slot/>
  </div>
</template>
<style>
  html,
  body,
  body > #app,
  .__histoire-render-story:not(.__histoire-render-custom-controls) > [data-v-app],
  .__histoire-render-story:not(.__histoire-render-custom-controls) #n-wrapper {
    --u-apply: min-h-full;
  }
  html[dir] #n-wrapper {
    --u-apply: bg-gray-50 border-rounded-2 box-border border-1 border-solid border-gray-200 font-inter p-6 text-gray-900;
  }
  html[dir].dark #n-wrapper {
    --u-apply: bg-gray-900 border-gray-900 text-gray-50;
  }
</style>