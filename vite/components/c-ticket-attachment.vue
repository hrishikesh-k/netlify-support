<script setup lang="ts">
  import {filesize} from 'filesize'
  import type {TZAttachment} from '~/types/global.ts'
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    attachment : TZAttachment
  }>()
</script>
<template>
  <span>{{filesize(props.attachment.size, {
    standard: 'iec'
  })}}</span>
</template>