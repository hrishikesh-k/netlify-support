<script setup lang="ts">
  import {cIcons, type CIconProps} from '~/types/props.ts'
  const props = withDefaults(defineProps<CIconProps>(), {
    size: 4
  })
</script>
<template>
  <svg
    class="fill-current"
    v-bind:height="props.size * 4"
    v-bind:width="props.size * 4"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg">
    <path v-bind:d="cIcons[props.name]"/>
  </svg>
</template>