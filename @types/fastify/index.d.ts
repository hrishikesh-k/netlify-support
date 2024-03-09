import type {HandlerContext, HandlerEvent} from '@netlify/functions'
import type {LambdaEvent} from '@netlify/blobs'
import type {TJwtPayload, TWretchBase} from '~/types/server.ts'
declare module 'fastify' {
  export interface FastifyRequest {
    awsLambda : {
      context : HandlerContext
      event : HandlerEvent & Pick<LambdaEvent, 'blobs' | 'headers'>
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