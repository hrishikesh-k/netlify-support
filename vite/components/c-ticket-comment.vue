<script setup lang="ts">
  import {computed} from 'vue'
  import CTicketAttachment from '~/client/components/c-ticket-attachment.vue'
  import PVCard, {type CardProps} from 'primevue/card'
  import type {TZComment, TZComments} from '~/types/global.ts'
  const commentAuthor = computed<string>(() => {
    const commentAuthorFromUsers = props.users.find(user => {
      return user.id === props.comment.author_id
    })
    if (commentAuthorFromUsers) {
      return commentAuthorFromUsers.name
    } else {
      return 'Unknown user'
    }
  })
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    comment : TZComment,
    users : TZComments['users']
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
      <span>{{commentAuthor}}</span>
    </template>
  </PVCard>
</template>
<style>
  [data-pc-name="card"][id^="c-"] a {
    --u-apply: text-inherit;
  }
  [data-pc-name="card"][id^="c-"] pre {
    --u-apply: whitespace-pre-wrap;
  }
</style>