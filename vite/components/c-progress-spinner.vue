<script setup lang="ts">
  import {computed} from 'vue'
  import PVProgressSpinner, {type ProgressSpinnerProps} from 'primevue/progressspinner'
  const props = defineProps<{
    size? : number
  }>()
  const pvProgressSpinnerProps = computed<ProgressSpinnerProps>(() => {
    return {
      pt: {
        circle: {
          class: 'animate-duration-1500 animate-iteration-count-infinite animate-name-pv-progress-spinner-dash stroke-current',
          style: {
            'stroke-dasharray': '89, 200',
            'stroke-dashoffset': '0'
          }
        },
        root: {
          style: {
            height: `${(props.size || 4) * 4}px`,
            width: `${(props.size || 4) * 4}px`
          }
        },
        spinner: 'animate-spin'
      }
    }
  })
</script>
<template>
  <PVProgressSpinner v-bind="pvProgressSpinnerProps"/>
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