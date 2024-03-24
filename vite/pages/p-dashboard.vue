<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import CSkeleton from '~/client/components/c-skeleton.vue'
  import CTicketListItem from '~/client/components/c-ticket-list-item.vue'
  import {onMounted, ref} from 'vue'
  import PVButton, {type ButtonProps} from 'primevue/button'
  import PVCard, {type CardProps} from 'primevue/card'
  import PVColumn, {type ColumnProps} from 'primevue/column'
  import PVDataTable, {type DataTableProps} from 'primevue/datatable'
  import PVDataView from 'primevue/dataview'
  import PVOverlayPanel, {type OverlayPanelProps} from 'primevue/overlaypanel'
  import type {TZTickets} from '~/types/global.ts'
  import {wretchBase} from '~/client/utils/constants.ts'
  const pvButtonStatusProps : ButtonProps = {
    pt: {
      label: 'order-1',
      root: 'bg-transparent border-0 cursor-pointer flex gap-x-1 font-inherit items-center p-0 text-4 text-inherit w-16'
    }
  }
  const pvButtonTicketProps : ButtonProps = {
    label: 'New ticket',
    pt: {
      root: 'bg-neutral-light-200 dark:bg-neutral-dark-500 dark:hover:bg-teal-900 hover:bg-teal-000 border-0 border-rounded-1.5 box-border cursor-pointer flex font-600 font-inherit gap-x-2 items-center p-x-4 p-y-2 text-4 dark:text-neutral-000 dark:hover:text-teal-100 hover:text-teal-800 transition-duration-250'
    }
  }
  const pvCardProps : CardProps = {
    pt: {
      root: 'bg-neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid dark:border-neutral-dark-700 box-border md:grid-col-span-2 lt-md:m-b-4 p-6'
    }
  }
  const pvColumnProps : ColumnProps = {
    pt: {
      bodyCell: 'border-y-0 box-border p-1'
    }
  }
  const pvDataTableProps : DataTableProps = {
    dataKey: 'status',
    pt: {
      bodyRow: 'border-x-0 divide-neutral-light-300 divide-solid divide-x-1 dark:divide-neutral-dark-600',
      table: 'border-collapse',
      tbody: 'divide-neutral-light-300 divide-solid divide-y-1 dark:divide-neutral-dark-600'
    },
    value: [{
      description: 'Locked due to inactivity. Replying to it would create a new (follow-up) ticket.',
      status: 'Closed'
    }, {
      description: 'Waiting on teams outside of Support',
      status: 'Hold'
    }, {
      description: 'Not yet opened by Support',
      status: 'New'
    }, {
      description: 'Awaiting your reply',
      status: 'Pending'
    }, {
      description: 'Waiting on Support for reply',
      status: 'Open'
    }, {
      description: 'Ticket resolved',
      status: 'Solved'
    }]
  }
  const pvOverlayPanelProps : OverlayPanelProps = {
    pt: {
      root: 'bg-neutral-000 dark:bg-neutral-dark-900 border-1 border-neutral-light-300 border-rounded-1.5 border-solid dark:border-neutral-dark-600 box-border m-t-0.5 max-w-60 p-3 text-3'
    }
  }
  const ticketList = ref<TZTickets>({
    count: 0,
    tickets: []
  })
  const ticketListError = ref<boolean>(false)
  const ticketListFetched = ref<boolean>(false)
  const ticketStatusOverlay = ref<null | PVOverlayPanel>(null)
  async function fetchTickets() {
    try {
      ticketList.value = await wretchBase.get('/tickets/list').json<TZTickets>()
      ticketListFetched.value = true
    } catch {
      // TODO: handle error
      ticketListError.value = true
    }
  }
  function ticketStatusOverlayToggle(event : Event) {
    if (ticketStatusOverlay.value) {
      ticketStatusOverlay.value.toggle(event)
    }
  }
  onMounted(async () => {
    await fetchTickets()
  })
</script>
<template>
  <div class="md:gap-4 md:grid md:grid-cols-3">
    <PVCard v-bind="pvCardProps">
      <template v-slot:content>
        <PVDataView data-key="id" v-bind:value="ticketList.tickets.slice(0, 4)">
          <template v-slot:empty>
            <p v-if="ticketListFetched">No tickets found</p>
            <div class="dark:odd:bg-neutral-000/3 odd:bg-neutral-light-100/50 box-border flex gap-x-3 items-center h-12 p-3" v-bind:key="i" v-for="i in 5" v-else>
              <CSkeleton width="4rem"/>
              <CSkeleton width="4rem"/>
              <CSkeleton class="flex-1"/>
              <CSkeleton width="6rem"/>
            </div>
          </template>
          <template v-slot:list="pvDataViewListItems">
            <div class="dark:odd:bg-neutral-000/3 odd:bg-neutral-light-100/50 box-border decoration-none flex gap-x-3 p-3">
              <span class="text-center w-16">ID</span>
              <PVButton label="Status" v-bind="pvButtonStatusProps" v-on:click="ticketStatusOverlayToggle">
                <template v-slot:icon>
                  <CIcon class="order-2" name="circle-question" v-bind:size="3"/>
                </template>
              </PVButton>
              <PVOverlayPanel ref="ticketStatusOverlay" v-bind="pvOverlayPanelProps">
                <PVDataTable v-bind="pvDataTableProps">
                  <!-- TODO: transition -->
                  <PVColumn header="Status" field="status" v-bind="pvColumnProps"></PVColumn>
                  <PVColumn header="Description" field="description" v-bind="pvColumnProps"></PVColumn>
                </PVDataTable>
              </PVOverlayPanel>
              <span class="text-center flex-1">Subject</span>
              <span class="sm:block hidden text-center w-24">Updated</span>
            </div>
            <CTicketListItem v-bind:ticket="pvDataViewListItem" v-for="pvDataViewListItem in pvDataViewListItems.items"/>
          </template>
        </PVDataView>
      </template>
      <template v-slot:title>
        <div class="flex gap-x-3 items-end justify-between m-b-3">
          <div class="border-0 border-b-1 border-neutral-light-300 border-solid dark:border-neutral-dark-600 flex flex-1 gap-x-2 items-center">
            <h2 class="m-0 peer">
              <RouterLink class="decoration-none text-inherit" to="/tickets">Tickets</RouterLink>
            </h2>
            <CIcon class="peer-hover:transform-translate-x-1 transition-duration-250" name="arrow-right" v-bind:size="3"/>
          </div>
          <RouterLink class="decoration-none" to="/tickets/new">
            <PVButton v-bind="pvButtonTicketProps">
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
        root: 'bg:neutral-000 dark:bg-neutral-dark-800 border-1 border-neutral-light-300 border-rounded-2 border-solid grid-col-span-1 dark:border-neutral-dark-700 box-border p-6'
      }">
    </PVCard>
  </div>
</template>