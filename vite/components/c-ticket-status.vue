<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import type {CIconProps} from '~/types/props.ts'
  import {computed} from 'vue'
  import PVTag, {type TagPassThroughOptions, type TagProps} from 'primevue/tag'
  import type {TZTicket} from '~/types/global'
  const props = defineProps<{
    status : TZTicket['status']
  }>()
  const pvTagProps = computed<TagProps & {
    icon : CIconProps['name']
  }>(() => {
    const pt : TagPassThroughOptions = {
      root: 'border-1 border-rounded-1 border-solid box-border flex gap-x-1 items-center p-1 text-3 '
    }
    let icon : CIconProps['name'] = 'plus'
    let severity : TagProps['severity'] = 'secondary'
    switch (props.status) {
      case 'closed':
        icon = 'lock'
        pt.root += 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200'
        severity = 'danger'
        break
      case 'hold':
        icon = 'pause'
        pt.root += 'bg-pink-100 dark:bg-pink-900 border-pink-400 dark:border-pink-500 text-pink-800 dark:text-pink-200'
        severity = 'info'
        break
      case 'new':
        icon = 'sparkles'
        pt.root += 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-200'
        severity = 'info'
        break
      case 'pending':
        icon = 'reply'
        pt.root += 'bg-gold-100 dark:bg-gold-900 border-gold-400 dark:border-gold-500 text-gold-800 dark:text-gold-200'
        severity = 'warning'
        break
      case 'open':
        icon = 'clock'
        pt.root += 'bg-purple-100 dark:bg-purple-900 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-200'
        severity = 'info'
        break
      case 'solved':
        icon = 'check'
        pt.root += 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-500 text-green-800 dark:text-green-200'
        severity = 'success'
        break
    }
    return {
      icon,
      pt,
      severity,
      value: `${props.status.slice(0, 1).toUpperCase()}${props.status.slice(1)}`
    }
  })
</script>
<template>
  <PVTag v-bind="pvTagProps">
    <template v-slot:icon>
      <CIcon class="sm:block hidden" v-bind:name="pvTagProps.icon" v-bind:size="3"/>
    </template>
  </PVTag>
</template>