import {ApiError} from '~/server/utils/functions.ts'
import {performance} from 'node:perf_hooks'
import {RouteTicketsListQuery} from '~/types/request.ts'
import {routeTicketListRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TZTickets} from "~/types/global.ts";
export default function (api: TFastifyTypebox) {
  return api.get('/tickets/list', {
    schema: {
      querystring: RouteTicketsListQuery,
      response: {
        200: routeTicketListRes
      }
    }
  }, async (req, res) => {
    const _handlerStart = performance.now()
    let ticketListRes
    req.wretchZendesk = req.wretchZendesk.query({
      page: req.query.page || 1,
      per_page: 10,
      sort_by: 'created_at',
      sort_order: 'desc'
    })
    if (req.query.category === 'organization') {
      if (req.user.zendesk!.org) {
        req.wretchZendesk = req.wretchZendesk.url(`/organizations/${req.user.zendesk!.org}/tickets.json`)
      } else {
        throw ApiError.forbidden('not a part of a Zendesk organization')
      }
    } else {
      req.wretchZendesk = req.wretchZendesk.url(`/users/${req.user.zendesk!.id}/tickets/${req.query.category || 'requested'}.json`)
    }
    try {
      const _ticketStart = performance.now()
      ticketListRes = await req.wretchZendesk.get().json<TZTickets>()
      res.addServerTiming('tickets', _ticketStart, performance.now())
    } catch (tickerListErr) {
      throw new ApiError('failed to fetch ticket list from Zendesk', tickerListErr)
    }
    res.addServerTiming('handler', _handlerStart, performance.now())
    return res.send(ticketListRes)
  })
}