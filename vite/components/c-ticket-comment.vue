<script setup lang="ts">
  import {computed} from 'vue'
  import CTicketAttachment from '~/client/components/c-ticket-attachment.vue'
  import {format, parseISO} from 'date-fns'
  import {nfUser, ticketUsers, zdUser} from '~/client/utils/constants.ts'
  import PVAvatar, {type AvatarProps} from 'primevue/avatar'
  import PVCard, {type CardProps} from 'primevue/card'
  import PVDataView from 'primevue/dataview'
  import type {TZComment} from '~/types/global.ts'
  const commentAuthor = computed<string>(() => {
    if (ticketUsers.value) {
      if (commentAuthorFromUsers.value) {
        if (commentAuthorFromUsers.value.email.endsWith('@netlify.com')) {
          return `${commentAuthorFromUsers.value.name} (Netlify)`
        } else if (commentAuthorFromUsers.value.id === zdUser.value!.id) {
          return `${commentAuthorFromUsers.value.name} (You)`
        } else {
          return commentAuthorFromUsers.value.name
        }
      } else {
        return 'Unknown user'
      }
    } else {
      return 'Error'
    }
  })
  const commentAuthorFromUsers = computed(() => {
    if (ticketUsers.value) {
      return ticketUsers.value.find(user => {
        return user.id === props.comment.author_id
      })
    } else {
      return null
    }
  })
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    comment : TZComment
  }>()
  const pvAvatarProps = computed<AvatarProps>(() => {
    const propsToReturn : AvatarProps = {
      pt: {
        image: 'border-rounded-full h-full w-full',
        root: 'bg-neutral-dark-500 border-rounded-full flex h-10 items-center justify-center w-10'
      }
    }
    if (commentAuthorFromUsers.value) {
      if (commentAuthorFromUsers.value.photo) {
        propsToReturn.image = commentAuthorFromUsers.value.photo.content_url
      } else if (commentAuthorFromUsers.value.id === zdUser.value!.id) {
        propsToReturn.image = nfUser.value!.avatar_url
      } else {
        propsToReturn.label = commentAuthor.value.slice(0, 1).toUpperCase()
      }
    }
    return propsToReturn
  })
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
      <template v-if="props.comment.attachments.length">
        <hr class="border-0 border-neutral-light-300 border-solid border-t-1 dark:border-neutral-dark-500"/>
        <span class="block m-b-3">Attachments:</span>
        <PVDataView data-key="id" v-bind:value="props.comment.attachments">
          <template v-slot:list="pvDataViewListItems">
            <CTicketAttachment v-bind:attachment="pvDataViewListItem" v-for="pvDataViewListItem in pvDataViewListItems.items"/>
          </template>
        </PVDataView>
      </template>
    </template>
    <template v-slot:header>
      <div class="flex gap-x-3 items-center m-b-3">
        <PVAvatar v-bind="pvAvatarProps"/>
        <div class="flex flex-col">
          <span>{{commentAuthor}}</span>
          <span class="text-3">{{format(parseISO(props.comment.created_at), '\'on\' yyyy-LL-dd \'at\' hh:mm:ss aa')}}</span>
        </div>
      </div>
      <hr class="border-0 border-neutral-light-300 border-solid border-t-1 dark:border-neutral-dark-500"/>
    </template>
  </PVCard>
</template>
<style>
  [data-pc-name="card"][id^="c-"] a {
    --u-apply: text-inherit;
  }
  [data-pc-name="card"][id^="c-"] p {
    --u-apply: m-0;
  }
  [data-pc-name="card"][id^="c-"] pre {
    --u-apply: whitespace-pre-wrap;
  }
</style>