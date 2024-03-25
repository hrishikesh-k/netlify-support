<script setup lang="ts">
  import CTicketStatus from '~/client/components/c-ticket-status.vue'
  import {format, parseISO} from 'date-fns'
  import type { TZTicket } from '~/types/global'
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    ticket : TZTicket
  }>()
</script>
<template>
  <RouterLink class="dark:odd:bg-neutral-000/3 dark:hover:bg-neutral-000/4 hover:bg-neutral-light-100/75 odd:bg-neutral-light-100/50 box-border decoration-none flex gap-x-3 p-3 text-current transition-duration-250" v-bind:to="`/tickets/${props.ticket.id}`">
    <span>{{props.ticket.id}}</span>
    <CTicketStatus v-bind:status="props.ticket.status"/>
    <span class="flex-1 text-truncate">{{props.ticket.subject}}</span>
    <span class="sm:block hidden">{{format(parseISO(props.ticket.updated_at), 'yyyy-LL-dd')}}</span>
  </RouterLink>
</template>