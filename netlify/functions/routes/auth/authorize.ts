import {ApiError} from '~/server/utils/functions.ts'
import {env} from 'node:process'
import {getStore} from '@netlify/blobs'
import {performance} from 'node:perf_hooks'
import {randomBytes} from 'node:crypto'
import {RouteAuthAuthorizeQuery} from '~/types/request.ts'
import {stringify} from 'qs'
import type {TFastifyTypebox} from '~/types/server.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/auth/authorize', {
    schema: {
      querystring: RouteAuthAuthorizeQuery
    }
  }, async (req, res) => {
    const _handlerStart = performance.now()
    const csrfStore = getStore('csrf_store')
    const csrfToken = randomBytes(32).toString('hex')
    try {
      const _blobStart = performance.now()
      await csrfStore.setJSON(csrfToken, {
        ip: req.ip,
        timestamp: Date.now()
      })
      res.addServerTiming('blob', _blobStart, performance.now())
    } catch (csrfErr) {
      throw ApiError.internalServerError('failed to store CSRF token', csrfErr)
    }
    res.addServerTiming('handler', _handlerStart, performance.now())
    return res.redirect(`https://app.netlify.com/authorize?${stringify({
      client_id: env['NETLIFY_CLIENT_ID'],
      redirect_uri: `${req.origin}/api/auth/callback`,
      response_type: 'code',
      state: stringify({
        csrf: csrfToken,
        redirect_to: req.query.redirect_to
      }, {
        encode: false
      })
    })}`)
  })
}