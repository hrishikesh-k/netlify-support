<script setup lang="ts">
  import CIcon from '~/client/components/c-icon.vue'
  import {format, parseISO} from 'date-fns'
  import {onMounted, ref} from 'vue'
  import PVButton from 'primevue/button'
  import PVCard from 'primevue/card'
  import PVColumn from 'primevue/column'
  import PVDataTable from 'primevue/datatable'
  import PVTag from 'primevue/tag'
  import {wretchBase} from '~/client/utils/constants.ts'
  import type {TZTickets} from '~/types/global.ts'
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
  onMounted(async () => {
    await fetchTickets()
  })
</script>
<template>
  <div class="gap-x-4 grid grid-cols-3">
    <PVCard
      v-bind:pt="{
        root: 'dark:bg-neutral-dark-800 border-1 border-rounded-2 border-solid grid-col-span-2 dark:border-neutral-dark-700 box-border p-6'
      }">
      <template v-slot:content>
        <PVDataTable
          v-bind:pt="{
            table: 'w-full'
          }"
          v-bind:value="ticketList.tickets"
          v-if="ticketList.tickets.length || ticketListFetched">
          <!-- TODO: Make error template, data fetching template and no tickets template -->
          <PVColumn field="id" header="Ticket ID"/>
          <PVColumn field="status" header="Status">
            <template v-slot:body="pvColumnBody">
              <PVTag v-bind:value="pvColumnBody.data.status"/>
            </template>
          </PVColumn>
          <PVColumn field="subject" header="Subject"/>
          <PVColumn field="updated_at" header="Updated">
            <template v-slot:body="pvColumnBody">{{format(parseISO(pvColumnBody.data.updated_at), 'yyyy-LL-dd')}}</template>
          </PVColumn>
        </PVDataTable>
      </template>
      <template v-slot:title>
        <div class="flex items-center justify-between">
          <h2 class="m-0">
            <RouterLink class="decodation-none text-inherit" to="/tickets">Tickets</RouterLink>
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