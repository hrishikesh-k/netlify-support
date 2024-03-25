<script setup lang="ts">
  import PVSkeleton, {type SkeletonProps} from 'primevue/skeleton'
  const props = defineProps<SkeletonProps>()
</script>
<template>
  <PVSkeleton class="after:animate-duration-1200 after:animate-iteration-count-infinite after:animate-name-pv-skeleton bg-neutral-000/6 after:bg-gradient-to-r border-rounded-1 after:content-empty after:from-transparent after:h-full after:left-0 overflow-hidden after:pos-absolute after:to-transparent after:top-0 after:via-neutral-000/4 after:w-full" v-bind="props"/>
</template>
<style>
  @keyframes pv-skeleton {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>