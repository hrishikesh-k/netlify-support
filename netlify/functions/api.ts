import {ApiError, Logger} from '~/server/utils/functions.ts'
import awsLambdaFastify from '@fastify/aws-lambda'
import {connectLambda} from '@netlify/blobs'
import {env} from 'node:process'
import {expTime, logLevels} from '~/server/utils/constants.ts'
import fastify, {type FastifyError, type FastifyReply} from 'fastify'
import fastifyCookie from '@fastify/cookie'
import {jwtDecrypt} from 'jose'
import {jwtSecret} from '~/server/utils/constants.ts'
import {performance} from 'node:perf_hooks'
import routeAuthAuthorize from '~/server/routes/auth/authorize.ts'
import routeAuthCallback from '~/server/routes/auth/callback.ts'
import routeAuthLogout from '~/server/routes/auth/logout.ts'
import routeForumsTopics from '~/server/routes/forums/topics.ts'
import routeSystemStatus from '~/server/routes/system/status.ts'
import routeTicketsComments from '~/server/routes/tickets/comments.ts'
import routeTicketsInfo from '~/server/routes/tickets/info.ts'
import routeTicketsList from '~/server/routes/tickets/list.ts'
import routeUserInfo from '~/server/routes/user/info.ts'
import type {TJwtPayload, TLogLevel} from '~/types/server.ts'
import type {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import wretch from 'wretch'
import wretchAbort from 'wretch/addons/abort'
import wretchFormUrl from 'wretch/addons/formUrl'
import wretchQueryString from 'wretch/addons/queryString'
const api = fastify({
  disableRequestLogging: true,
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
  logger: new Logger(),
  requestIdHeader: 'x-nf-request-id'
}).withTypeProvider<TypeBoxTypeProvider>()
api.addHook('onRequest', (req, res, done) => {
  const _onRequestHookStart = performance.now()
  // https://github.com/microsoft/TypeScript/issues/26255
  const logLevelHeader = req.headers['x-nfsp-log-level'] as TLogLevel
  if (logLevels.includes(logLevelHeader)) {
    req.log.level = logLevelHeader
  }
  connectLambda(req.awsLambda.event)
  req.origin = new URL(req.awsLambda.event.rawUrl).origin
  req.wretchBase = wretch().addon(wretchAbort()).addon(wretchFormUrl).addon(wretchQueryString)
  req.wretchDiscourse = req.wretchBase.headers({
    'api-key': env['DISCOURSE_KEY']!,
    'api-username': env['DISCOURSE_USERNAME']!
  }).url('https://answers.netlify.com')
  req.wretchNetlify = req.wretchBase.url('https://api.netlify.com/api/v1')
  req.wretchZendesk = req.wretchBase.auth(`Basic ${btoa(`${env['ZENDESK_USERNAME']}/token:${env['ZENDESK_PASSWORD']}`)}`).url('https://netlify.zendesk.com/api/v2')
  res.serverTimings = []
  res.addServerTiming('onRequestHook', _onRequestHookStart, performance.now())
  done()
})
api.addHook('onSend', (req, res, _payload, done) => {
  if (req.log.level === 'trace' && res.serverTimings.length) {
    res.header('server-timing', res.serverTimings.join(','))
  }
  done()
})
api.addHook('preHandler', async (req, res) => {
  const _preHandlerHookStart = performance.now()
  if (req.url.split('/')[2] !== 'auth') {
    let nfToken = req.cookies['nf_token']
    if (!nfToken && req.headers['authorization']) {
      nfToken = req.headers['authorization'].slice(7)
    }
    if (nfToken) {
      try {
        const _jwtStart = performance.now()
        const jwt = await jwtDecrypt<TJwtPayload>(nfToken, jwtSecret)
        delete jwt.payload.exp
        req.nfToken = jwt.payload
        req.wretchNetlify = req.wretchNetlify.auth(`Bearer ${req.nfToken.nf_token}`)
        res.addServerTiming('jwt', _jwtStart, performance.now())
      } catch {
        throw ApiError.forbidden('nf_token invalid')
      }
    } else {
      throw ApiError.unauthorized('nf_token missing')
    }
  }
  res.addServerTiming('preHandlerHook', _preHandlerHookStart, performance.now())
})
api.decorateReply('addServerTiming', function (this : FastifyReply, name : string, start? : number, end? : number, description? : string) : undefined {
  let headerValue = name
  if (start && end) {
    headerValue += `;dur=${(end - start).toFixed(2)}`
  }
  if (description) {
    headerValue += `;desc="${description}"`
  }
  this.serverTimings.push(headerValue)
})
api.decorateReply('serverTimings', null)
api.decorateRequest('nfToken', null)
api.decorateRequest('origin', null)
api.decorateRequest('wretchBase', null)
api.decorateRequest('wretchDiscourse', null)
api.decorateRequest('wretchNetlify', null)
api.decorateRequest('wretchZendesk', null)
api.register(fastifyCookie, {
  parseOptions: {
    httpOnly: true,
    maxAge: expTime,
    path: '/api/',
    sameSite: true,
    secure: true
  }
})
api.register((app, _options, done) => {
  routeAuthAuthorize(app)
  routeAuthCallback(app)
  routeAuthLogout(app)
  routeForumsTopics(app)
  routeSystemStatus(app)
  routeTicketsComments(app)
  routeTicketsInfo(app)
  routeTicketsList(app)
  routeUserInfo(app)
  done()
}, {
  prefix: '/api/'
})
api.setErrorHandler((err : ApiError | FastifyError, req, res) => {
  if (err instanceof ApiError && err.cause) {
    req.log.error(err.cause)
  } else {
    req.log.error(err)
  }
  return res.code(err.statusCode || 500).send({
    msg: err.message,
    req_id: req.id
  })
})
export const handler = awsLambdaFastify(api)