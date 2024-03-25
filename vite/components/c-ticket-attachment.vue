<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import {filesize} from 'filesize'
  import PVButton, {type ButtonProps} from 'primevue/button'
  import type {TZAttachment} from '~/types/global.ts'
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    attachment : TZAttachment
  }>()
  const pvButtonProps : ButtonProps = {
    pt: {
      label: 'hidden',
      root: 'bg-neutral-light-200 dark:bg-neutral-dark-500 dark:hover:bg-teal-900 hover:bg-teal-000 border-0 border-rounded-1 cursor-pointer flex items-center justify-center h-8 p-0 dark:text-neutral-000 dark:hover:text-teal-100 hover:text-teal-800 transition-duration-250 w-8'
    }
  }
</script>
<template>
  <div class="dark:odd:bg-neutral-000/3 odd:bg-neutral-light-100/50 box-border flex gap-x-3 items-center justify-between p-3">
    <span>{{props.attachment.file_name}}</span>
    <span>{{filesize(props.attachment.size, {
      standard: 'iec'
    })}}</span>
    <a v-bind:download="props.attachment.file_name" v-bind:href="props.attachment.content_url" rel="nofollow noopened noreferrer" target="_blank">
      <PVButton aria-label="Download" v-bind="pvButtonProps">
        <template v-slot:icon>
          <CIcon name="arrow-down-to-line"/>
        </template>
      </PVButton>
    </a>
  </div>
</template>