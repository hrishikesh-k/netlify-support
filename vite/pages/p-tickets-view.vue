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
  import {useRoute} from 'vue-router'
  import {wretchBase} from '~/client/utils/constants.ts'
  import {WretchError} from 'wretch/resolver'
  const pvDataTableProps = computed<DataTableProps>(() => {
    const value : DataTableProps['value'] = []
    value.push({
      name: 'Subject',
      value: ticketInfo.value?.subject
    })
    return {
      dataKey: 'name',
      pt: {
        root: 'bg:neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border grid-col-span-1 p-3 md:pos-sticky md:self-start md:top-28.5'
      },
      value
    }
  })
  const route = useRoute()
  const ticketComments = ref<TZComments>({
    comments: [],
    count: 0,
    users: []
  })
  const ticketInfo = ref<null | TZTicket>(null)
  async function fetchTicketComments() {
    try {
      ticketComments.value = await wretchBase.get(`/tickets/${route.params.id}/comments`).json<TRouteTicketCommentsRes>()
    } catch {
      // TODO: handle error
    }
  }
  onMounted(async () => {
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
        <div class="flex flex-col gap-y-6">
          <div class="bg:neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border p-3" v-bind:key="i" v-for="i in 5">
            <CSkeleton height="1.25rem" width="15rem"/>
            <CSkeleton class="m-t-3" height="10rem" width="100%"/>
          </div>
        </div>
      </template>
      <template v-slot:list="pvDataViewListItems">
        <CTicketComment v-bind:comment="pvDataViewListItem" v-bind:users="ticketComments.users" v-for="pvDataViewListItem in pvDataViewListItems.items"/>
      </template>
    </PVDataView>
  </div>
</template>