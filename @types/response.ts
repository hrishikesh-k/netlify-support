import {Array, Boolean, Literal, Integer, Object, type Static, String, Union} from '@sinclair/typebox'
import {typeboxEmail, typeboxZdTicket, typeboxZdUser} from '~/server/utils/constants.ts'
export const RouteAuthCallbackRes = Object({
  admin: Boolean(),
  nf_id: String(),
  nf_token: String(),
  zd_id: Integer(),
  zd_ord: Integer()
})
export const RouteForumsTopicsRes = Array(Object({
  has_accepted_answer: Boolean(),
  id: Integer(),
  reply_count: Integer(),
  title: String(),
  views: Integer()
}), {
  maxItems: 15
})
export const RouteSystemStatusRes = Object({
  page: Object({
    url: String({
      format: 'uri'
    })
  }),
  status: Object({
    description: Union([
      Literal('All Systems Operational'),
      Literal('Major System Outage'),
      Literal('Minor Service Outage'),
      Literal('Partial System Outage'),
      Literal('Partially Degraded Service'),
      Literal('Service Under Maintenance')
    ]),
    indicator: Union([
      Literal('critical'),
      Literal('maintenance'),
      Literal('major'),
      Literal('minor'),
      Literal('none')
    ])
  })
})
export const RouteTicketCommentsRes = Object({
  comments: Object({}),
  count: Integer()
})
export const RouteTicketsInfoRes = Object({
  followers: Array(typeboxZdUser),
  related: Array(Integer()),
  ticket: typeboxZdTicket
})
export const RouteTicketListRes = Object({
  count: Integer(),
  tickets: Array(typeboxZdTicket, {
    maxItems: 10
  })
})
export const RouteUserInfoRes = Object({
  nf: Object({
    avatar_url: String({
      format: 'uri'
    }),
    email: typeboxEmail,
    full_name: String(),
    id: String(),
    support_priority: Integer()
  }),
  zd: typeboxZdUser
})
export type TRouteSystemStatusRes = Static<typeof RouteSystemStatusRes>
export type TRouteUserInfoRes = Static<typeof RouteUserInfoRes>