import type {HandlerContext, HandlerEvent} from '@netlify/functions'
import type {TJwtPayload, TWretchBase} from '~/types/server.ts'
declare module 'fastify' {
  export interface FastifyRequest {
    awsLambda : {
      context : HandlerContext
      event : HandlerEvent
    }
    nfToken : TJwtPayload
    origin : string
    wretchBase : TWretchBase
    wretchDiscourse : TWretchBase
    wretchNetlify : TWretchBase
    wretchZendesk : TWretchBase
  }
}
export {}