import {Integer, Literal, Object, Optional, type Static, String, Union} from '@sinclair/typebox'
export const RouteAuthAuthorizeQuery = Object({
  redirect_to: String({
    pattern: '^/(dashboard|tickets)?$'
  })
})
export const RouteAuthCallbackQuery = Object({
  code: String({
    maxLength: 43,
    minLength: 43
  }),
  state: String({
    pattern: '^csrf=[a-zA-Z0-9]{64}&redirect_to=/(dashboard|tickets)?$'
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
export const routeUserCreateZendeskBody = Object({
  name: String(),
  photo: Optional(String({
    format: 'uri'
  }))
})
export type TRouteAuthAuthorizeQuery = Static<typeof RouteAuthAuthorizeQuery>