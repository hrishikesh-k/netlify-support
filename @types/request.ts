import {Integer, Literal, Object, Optional, type Static, String, Union} from '@sinclair/typebox'
export const RouteAuthAuthorizeQuery = Object({
  csrf: Integer({
    maximum: 99999,
    minimum: 10000
  }),
  redirect_to: String({
    pattern: '^/(dashboard|tickets)$'
  })
})
export const RouteAuthCallbackQuery = Object({
  code: String({
    maxLength: 43,
    minLength: 43
  }),
  state: String({
    pattern: '^csrf=\\d{5}&redirect_to=/(dashboard|tickets)$'
  })
})
export const RouteForumsTopicsQuery = Object({
  type: Union([
    Literal('latest'),
    Literal('top')
  ])
})
export const RouteTicketCommentsParams = Object({
  id: Integer()
})
export const RouteTicketsInfoParams = RouteTicketCommentsParams
export const RouteTicketsListQuery = Object({
  category: Optional(Union([
    Literal('ccd'),
    Literal('organization'),
    Literal('requested')
  ])),
  page: Optional(Integer({
    maximum: 100
  }))
})
export type TRouteAuthAuthorizeQuery = Static<typeof RouteAuthAuthorizeQuery>