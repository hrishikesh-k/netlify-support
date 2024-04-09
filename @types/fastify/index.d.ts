import type {HandlerContext, HandlerEvent} from '@netlify/functions'
import type {LambdaEvent} from '@netlify/blobs'
import type {TJwtPayload, TWretchBase} from '~/types/server.ts'
declare module 'fastify' {
  export interface FastifyReply {
    addServerTiming: (this : FastifyReply, name : string, start? : number, end? : number, description? : string) => undefined
    serverTimings : Array<string>
  }
  export interface FastifyRequest {
    awsLambda : {
      context : HandlerContext
      event : HandlerEvent & Pick<LambdaEvent, 'blobs' | 'headers'>
    }
    origin : string
    user : TJwtPayload
    wretchBase : TWretchBase
    wretchDiscourse : TWretchBase
    wretchNetlify : TWretchBase
    wretchZendesk : TWretchBase
  }
}
export {}