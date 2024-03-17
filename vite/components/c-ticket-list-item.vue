<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import type {CIconProps, CTicketListItemProps} from '~/types/props.ts'
  import {computed} from 'vue'
  import {format, parseISO} from 'date-fns'
  import PVTag, {type TagPassThroughOptions, type TagProps} from 'primevue/tag'
  const props = defineProps<{
    // created a property due to: https://www.github.com/vuejs/core/issues/8468
    ticket : CTicketListItemProps
  }>()
  const pvTagProps = computed<TagProps & {
    icon : CIconProps['name']
  }>(() => {
    const pt : TagPassThroughOptions = {
      root: 'border-1 border-rounded-1 border-solid box-border flex gap-x-1 items-center p-1 text-3 '
    }
    let icon : CIconProps['name'] = 'plus'
    let severity : TagProps['severity'] = 'secondary'
    switch (props.ticket.status) {
      case 'closed':
        icon = 'lock'
        pt.root += 'dark:bg-red-900 dark:border-red-500 dark:text-red-200'
        severity = 'danger'
        break
      case 'hold':
        icon = 'pause'
        pt.root += 'dark:bg-pink-900 dark:border-pink-500 dark:text-pink-200'
        severity = 'info'
        break
      case 'new':
        icon = 'sparkles'
        pt.root += 'dark:bg-blue-900 dark:border-blue-500 dark:text-blue-200'
        severity = 'info'
        break
      case 'pending':
        icon = 'reply'
        pt.root += 'dark:bg-gold-900 dark:border-gold-500 dark:text-gold-200'
        severity = 'warning'
        break
      case 'open':
        icon = 'clock'
        pt.root += 'dark:bg-purple-900 dark:border-purple-500 dark:text-purple-200'
        severity = 'info'
        break
      case 'solved':
        icon = 'check'
        pt.root += 'dark:bg-green-900 dark:border-green-500 dark:text-green-200'
        severity = 'success'
        break
    }
    return {
      icon,
      pt,
      severity,
      value: `${props.ticket.status.slice(0, 1).toUpperCase()}${props.ticket.status.slice(1)}`
    }
  })
</script>
<template>
  <RouterLink class="dark:odd:bg-neutral-000/3 dark:hover:bg-neutral-000/4 box-border decoration-none flex gap-x-3 p-3 text-current transition-duration-250" v-bind:to="`/tickets/${props.ticket.id}`">
    <span>{{props.ticket.id}}</span>
    <PVTag v-bind="pvTagProps">
      <template v-slot:icon>
        <CIcon v-bind:name="pvTagProps.icon" v-bind:size="3"/>
      </template>
    </PVTag>
    <span class="flex-1 text-truncate">{{props.ticket.subject}}</span>
    <span>{{format(parseISO(props.ticket.updated_at), 'yyyy-LL-dd')}}</span>
  </RouterLink>
</template>