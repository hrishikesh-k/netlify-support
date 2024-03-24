<script setup lang="ts">
  import CTicketAttachment from '~/client/components/c-ticket-attachment.vue'
  import PVCard, {type CardProps} from 'primevue/card'
  import {nfUser, zdUser} from '~/client/utils/constants.ts'
  import type {TZComment} from '~/types/global.ts'
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    comment : TZComment
  }>()
  const pvCardProps : CardProps = {
    pt: {
      root: {
        class: 'bg:neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border p-3',
        id: `c-${props.comment.id}`
      }
    }
  }
</script>
<template>
  <PVCard v-bind="pvCardProps">
    <template v-slot:content>
      <div v-html="props.comment.html_body"></div>
    </template>
    <template v-slot:footer>
      <CTicketAttachment v-bind:attachment="attachment" v-bind:key="attachment.id" v-for="attachment in props.comment.attachments"/>
    </template>
    <template v-slot:header>
      <span>{{props.comment.author_id === zdUser!.id ? nfUser!.full_name : props.comment.author_id}}</span>
    </template>
  </PVCard>
</template>
<style>
  [data-pc-name="card"][id^="c-"] pre {
    --u-apply: whitespace-pre-wrap;
  }
</style>