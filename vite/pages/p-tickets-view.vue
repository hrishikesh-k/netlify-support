<script setup lang="ts">
  import CTicketComment from '~/client/components/c-ticket-comment.vue'
  import {onMounted, ref} from 'vue'
  import PVDataView from 'primevue/dataview'
  import type {TRouteTicketCommentsRes, TRouteTicketInfoRes} from '~/types/response.ts'
  import type {TZComments, TZTicket} from '~/types/global.ts'
  import {useRoute} from 'vue-router'
  import {wretchBase} from '~/client/utils/constants.ts'
  import {WretchError} from 'wretch/resolver'
  const route = useRoute()
  const ticketComments = ref<TZComments>({
    comments: [],
    count: 0
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
  <PVDataView data-key="id" v-bind:pt="{
    content: 'flex flex-col gap-y-6'
  }" v-bind:value="ticketComments.comments">
    <template v-slot:empty></template>
    <template v-slot:list="pvDataViewListItems">
      <CTicketComment v-bind:comment="pvDataViewListItem" v-for="pvDataViewListItem in pvDataViewListItems.items"/>
    </template>
  </PVDataView>
</template>