<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import {format, parseISO} from 'date-fns'
  import {onMounted, ref} from 'vue'
  import PVButton from 'primevue/button'
  import PVCard from 'primevue/card'
  import PVDataView from 'primevue/dataview'
  import PVSkeleton from 'primevue/skeleton'
  import PVTag, {type TagPassThroughOptions, type TagProps} from 'primevue/tag'
  import {wretchBase} from '~/client/utils/constants.ts'
  import type {TZTicket, TZTickets} from '~/types/global.ts'
  const ticketList = ref<TZTickets>({
    count: 0,
    tickets: []
  })
  const ticketListError = ref<boolean>(false)
  const ticketListFetched = ref<boolean>(false)
  async function fetchTickets() {
    try {
      ticketList.value = await wretchBase.get('/tickets/list').json<TZTickets>()
      ticketListFetched.value = true
    } catch {
      // TODO: handle error
      ticketListError.value = true
    }
  }
  function pvTagProps(status : TZTicket['status']) : TagProps {
    const pt : TagPassThroughOptions = {
      root: 'border-rounded-1 box-border p-1 text-3 dark:bg-green-900 dark:text-green-200 '
    }
    let value : TagProps['value']
    switch (status) {
      case 'closed':
        pt.root += ''
        value = 'Closed'
        break
      case 'hold':
    }
    return {
      pt,
      value
    }
  }
  onMounted(async () => {
    await fetchTickets()
  })
</script>
<template>
  <div class="md:gap-x-4 md:grid md:grid-cols-3">
    <PVCard
      v-bind:pt="{
        root: 'dark:bg-neutral-dark-800 border-1 border-rounded-2 border-solid grid-col-span-2 dark:border-neutral-dark-700 box-border p-6'
      }">
      <template v-slot:content>
        <PVDataView data-key="id" v-bind:rows="4" v-bind:value="ticketList.tickets.slice(4)">
          <template v-slot:empty>
            <div class="dark:even:bg-neutral-000/3 box-border flex gap-x-3 items-center h-12 p-3" v-bind:key="i" v-for="i in 4">
              <PVSkeleton class="after:animate-duration-1200 after:animate-iteration-count-infinite after:animate-name-pv-skeleton bg-neutral-000/6 after:bg-gradient-to-r border-rounded-1 after:content-empty after:from-transparent after:h-full after:left-0 overflow-hidden after:pos-absolute after:to-transparent after:top-0 after:via-neutral-000/4 after:w-full" width="4rem"/>
              <PVSkeleton class="after:animate-duration-1200 after:animate-iteration-count-infinite after:animate-name-pv-skeleton bg-neutral-000/6 after:bg-gradient-to-r border-rounded-1 after:content-empty after:from-transparent after:h-full after:left-0 overflow-hidden after:pos-absolute after:to-transparent after:top-0 after:via-neutral-000/4 after:w-full" width="2rem"/>
              <PVSkeleton class="after:animate-duration-1200 after:animate-iteration-count-infinite after:animate-name-pv-skeleton bg-neutral-000/6 after:bg-gradient-to-r border-rounded-1 after:content-empty flex-1 after:from-transparent after:h-full after:left-0 overflow-hidden after:pos-absolute after:to-transparent after:top-0 after:via-neutral-000/4 after:w-full"/>
              <PVSkeleton class="after:animate-duration-1200 after:animate-iteration-count-infinite after:animate-name-pv-skeleton bg-neutral-000/6 after:bg-gradient-to-r border-rounded-1 after:content-empty after:from-transparent after:h-full after:left-0 overflow-hidden after:pos-absolute after:to-transparent after:top-0 after:via-neutral-000/4 after:w-full" width="6rem"/>
            </div>
          </template>
          <template v-slot:list="pvDataViewListItems">
            <RouterLink class="dark:even:bg-neutral-000/3 dark:hover:bg-neutral-000/4 box-border decoration-none flex gap-x-3 p-3 text-current" v-bind:to="`/tickets/${pvDataViewListItem.id}`" v-for="pvDataViewListItem in pvDataViewListItems.items">
              <span>{{pvDataViewListItem.id}}</span>
              <PVTag v-pv-tooltip="{
                pt: {
                  root: 'dark:bg-neutral-dark-600 border-1 border-rounded-1 border-solid dark:border-neutral-dark-500 box-border p-1 pos-absolute dark:text-neutral-000'
                },
                value: 'Hello'
              }" v-bind="pvTagProps(pvDataViewListItem.status)"/>
              <span class="flex-1 text-truncate">{{pvDataViewListItem.subject}}</span>
              <span>{{format(parseISO(pvDataViewListItem.updated_at), 'yyyy-LL-dd')}}</span>
            </RouterLink>
          </template>
        </PVDataView>
      </template>
      <template v-slot:title>
        <div class="flex items-center justify-between">
          <h2 class="m-0">
            <RouterLink class="decoration-none text-inherit" to="/tickets">Tickets</RouterLink>
          </h2>
          <RouterLink class="decoration-none" to="/tickets/new">
            <PVButton
              label="New ticket"
              v-bind:pt="{
                root: 'dark:bg-neutral-dark-500 dark:hover:bg-teal-900 border-0 border-rounded-1.5 box-border cursor-pointer flex font-600 font-mulish gap-x-2 items-center p-x-4 p-y-2 text-4 dark:text-neutral-000 dark:hover:text-teal-100 transition-duration-250'
              }">
              <template v-slot:icon>
                <CIcon name="plus" v-bind:size="3"/>
              </template>
            </PVButton>
          </RouterLink>
        </div>
      </template>
    </PVCard>
    <PVCard
      v-bind:pt="{
        root: 'dark:bg-neutral-dark-800 border-1 border-rounded-2 border-solid grid-col-span-1 dark:border-neutral-dark-700 box-border p-6'
      }">
    </PVCard>
  </div>
</template>
<style>
 @keyframes pv-skeleton {
   0% {
     transform: translateX(-100%);
   }
   100% {
     transform: translateX(100%);
   }
 }
</style>