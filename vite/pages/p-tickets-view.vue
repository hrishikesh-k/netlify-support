<script setup lang="ts">
  import {computed, onMounted, ref} from 'vue'
  import CSkeleton from '~/client/components/c-skeleton.vue'
  import CTicketComment from '~/client/components/c-ticket-comment.vue'
  import CTicketStauts from '~/client/components/c-ticket-status.vue'
  import PVColumn from 'primevue/column'
  import PVDataTable, {type DataTableProps} from 'primevue/datatable'
  import PVDataView from 'primevue/dataview'
  import type {TRouteTicketCommentsRes, TRouteTicketInfoRes} from '~/types/response.ts'
  import type {TZComments, TZTicket} from '~/types/global.ts'
  import {ticketUsers} from '~/client/utils/constants.ts'
  import {useRoute} from 'vue-router'
  import {wretchBase} from '~/client/utils/constants.ts'
  import {WretchError} from 'wretch/resolver'
  const pvDataTableProps = computed<DataTableProps>(() => {
    const value : DataTableProps['value'] = []
    if (ticketInfo.value) {
      value.push({
        name: 'Subject',
        value: ticketInfo.value.subject
      })
      value.push({
        name: 'Created',
        value: new Date(ticketInfo.value.created_at).toLocaleString()
      })
      value.push({
        name: 'Updated',
        value: new Date(ticketInfo.value.updated_at).toLocaleString()
      })
    }
    return {
      dataKey: 'name',
      pt: {
        root: 'bg:neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border grid-col-span-1 p-3 md:pos-sticky md:self-start md:top-28.5'
      },
      value
    }
  })
  const route = useRoute()
  const ticketComments = ref<Omit<TZComments, 'users'>>({
    comments: [],
    count: 0
  })
  const ticketCommentsLoaded = ref<boolean>(false)
  const ticketInfo = ref<null | TZTicket>(null)
  async function fetchTicketComments() {
    try {
      const ticketCommentsRes = await wretchBase.get(`/tickets/${route.params.id}/comments`).json<TRouteTicketCommentsRes>()
      ticketComments.value.comments = ticketCommentsRes.comments
      ticketComments.value.count = ticketCommentsRes.count
      ticketUsers.value = ticketCommentsRes.users
      ticketCommentsLoaded.value = true
    } catch {
      // TODO: handle error
    }
  }
  onMounted(async () => {
    ticketUsers.value = null
    try {
      const ticketInfoRes = await wretchBase.get(`/tickets/${route.params.id}/info`).json<TRouteTicketInfoRes>()
      ticketInfo.value = ticketInfoRes.ticket
    } catch (ticketInfoErr) {
      if (ticketInfoErr instanceof WretchError && (ticketInfoErr.status === 401 || ticketInfoErr.status === 403)) {
        // TODO: show forbidden error
      }
      // TODO: handle error
    }
    if (ticketInfo.value) {
      await fetchTicketComments()
    }
  })
</script>
<template>
  <div class="flex gap-x-3 items-center m-b-6">
    <template v-if="ticketInfo">
      <h2 class="m-0">Ticket #{{ticketInfo.id}}: {{ticketInfo.subject}}</h2>
      <CTicketStauts v-bind:status="ticketInfo.status"/>
    </template>
    <template v-else>
      <CSkeleton height="1.875rem" width="28rem"/>
      <CSkeleton height="1.5rem" width="4rem"/>
    </template>
  </div>
  <div class="lt-md:gap-y-6 md:gap-x-3 grid grid-cols-1 md:grid-cols-3">
    <PVDataTable v-bind="pvDataTableProps">
      <PVColumn field="name"/>
      <PVColumn field="value"/>
      <template v-slot:empty>
        <div class="flex flex-col gap-y-3">
          <div class="flex gap-x-3">
            <CSkeleton height="1.25rem" width="4rem"/>
            <CSkeleton height="1.25rem" width="12rem"/>
          </div>
          <div class="flex gap-x-3">
            <CSkeleton height="1.25rem" width="4rem"/>
            <CSkeleton height="1.25rem" width="8rem"/>
          </div>
          <div class="flex gap-x-3">
            <CSkeleton height="1.25rem" width="4rem"/>
            <CSkeleton height="1.25rem" width="10rem"/>
          </div>
        </div>
      </template>
    </PVDataTable>
    <PVDataView data-key="id" v-bind:pt="{
      content: 'flex flex-col gap-y-3 md:gap-y-6',
      root: 'grid-col-span-2'
    }" v-bind:value="ticketComments.comments">
      <template v-slot:empty>
        <p class="m-0" v-if="ticketCommentsLoaded">No comments</p>
        <div class="flex flex-col gap-y-6" v-else>
          <div class="bg:neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border p-3" v-bind:key="i" v-for="i in 5">
            <div class="flex gap-x-3 items-center">
              <div class="border-rounded-full h-10 overflow-hidden w-10">
                <CSkeleton height="2.5rem" width="2.5rem"/>
              </div>
              <div class="flex flex-col gap-y-1">
                <CSkeleton height="1.25rem" width="12rem"/>
                <CSkeleton height="0.75rem" width="9rem"/>
              </div>
            </div>
            <hr class="border-0 border-neutral-light-300 border-solid border-t-1 dark:border-neutral-dark-500"/>
            <CSkeleton class="m-t-3" width="100%" v-bind:height="`${Math.random() * (500 - 50) + 50}px`"/>
            <template v-if="Math.random() > 0.25">
              <hr class="border-0 border-neutral-light-300 border-solid border-t-1 dark:border-neutral-dark-500"/>
              <CSkeleton class="m-b-3" height="1.25rem" width="12rem"/>
              <div class="flex flex-col">
                <div class="dark:odd:bg-neutral-000/3 odd:bg-neutral-light-100/50 box-border flex gap-x-3 items-center justify-between p-3">
                  <CSkeleton height="1.25rem" width="12rem"/>
                  <CSkeleton height="1.25rem" width="3rem"/>
                  <CSkeleton height="2rem" width="2rem"/>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-slot:list="pvDataViewListItems">
        <CTicketComment v-bind:comment="pvDataViewListItem" v-for="pvDataViewListItem in pvDataViewListItems.items"/>
      </template>
    </PVDataView>
  </div>
</template>