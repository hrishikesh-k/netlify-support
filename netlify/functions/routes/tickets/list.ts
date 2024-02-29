import {ApiError} from '~/server/utils/functions.ts'
import {RouteTicketsListQuery} from '~/types/request.ts'
import {RouteTicketListRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TZTickets} from "~/types/global.ts";
export default function (api: TFastifyTypebox) {
  return api.get('/tickets/list', {
    schema: {
      querystring: RouteTicketsListQuery,
      response: {
        200: RouteTicketListRes
      }
    }
  }, async (req, res) => {
    let ticketListRes
    req.wretchZendesk = req.wretchZendesk.query({
      page: req.query.page || 1,
      per_page: 10,
      sort_by: 'created_at',
      sort_order: 'desc'
    })
    if (req.query.category === 'organization') {
      if (req.nfToken.zd_org) {
        req.wretchZendesk = req.wretchZendesk.url(`/organizations/${req.nfToken.zd_org}/tickets.json`)
      } else {
        throw ApiError.forbidden('not a part of a Zendesk organization')
      }
    } else {
      req.wretchZendesk = req.wretchZendesk.url(`/users/${req.nfToken.zd_id}/tickets/${req.query.category || 'requested'}.json`)
    }
    try {
      ticketListRes = await req.wretchZendesk.get().json<TZTickets>()
    } catch (tickerListErr) {
      throw new ApiError('failed to fetch ticket list from Zendesk', tickerListErr)
    }
    return res.send(ticketListRes)
  })
}