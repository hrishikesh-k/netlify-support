import type {FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault} from 'fastify'
import {logLevels} from '~/server/utils/constants.ts'
import type {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import type {AbortWretch, AbortResolver, FormUrlAddon, QueryStringAddon} from 'wretch/addons'
import type {Wretch} from 'wretch'
export type TFastifyTypebox = FastifyInstance<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyBaseLogger, TypeBoxTypeProvider>
export type TJwtPayload = {
  email : string
  nf_id : string
  nf_token : string
  zd_id : number
  zd_org : null | number
}
export type TTicketTokenJwtPayload = {
  ticket_id : number
  user_type? : 'follower' | 'netlify' | 'organization' | 'requester'
}
export type TLogLevel = typeof logLevels[number]
export type TWretchBase = QueryStringAddon & AbortWretch & FormUrlAddon & Wretch<AbortWretch & FormUrlAddon & QueryStringAddon, AbortResolver, undefined>