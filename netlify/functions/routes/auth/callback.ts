import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {env} from 'node:process'
import {expTime, jwtSecret} from '~/server/utils/constants.ts'
import {parse} from 'qs'
import {performance} from 'node:perf_hooks'
import {RouteAuthCallbackQuery} from '~/types/request.ts'
import {routeAuthCallbackRes} from '~/types/response.ts'
import type {TFastifyTypebox, TJwtPayload} from '~/types/server.ts'
import type {TNUser} from '~/types/global.ts'
import {getStore} from "@netlify/blobs";
export default function (api : TFastifyTypebox) {
  return api.get('/auth/callback', {
    schema: {
      querystring: RouteAuthCallbackQuery,
      response: {
        200: routeAuthCallbackRes
      }
    }
  }, async (req, res) => {
    const _handlerStart = performance.now()
    const csrfStore = getStore('csrf_store')
    const parsedState = parse(req.query.state) as unknown as {
      csrf : string
      redirect_to : string
    }
    let csrfBlob
    let jwt
    let tokenRes
    let userRes
    try {
      const _blobStart = performance.now()
      csrfBlob = await csrfStore.get(parsedState.csrf, {
        type: 'json'
      })
      res.addServerTiming('blobGet', _blobStart, performance.now())
    } catch (csrfBlobErr) {
      throw ApiError.internalServerError('failed to query csrf store', csrfBlobErr)
    }
    if (csrfBlob) {
      try {
        const _blobStart = performance.now()
        await csrfStore.delete(parsedState.csrf)
        res.addServerTiming('blobDel', _blobStart, performance.now())
      } catch {
        // no need to throw this error
        // TODO: still log it maybe?
      }
      if (csrfBlob.ip !== req.ip || csrfBlob.timestamp < (Date.now() - (5 * 60 * 1000))) {
        throw ApiError.badRequest('csrf token IP or timestamp mismatch')
      }
    } else {
      throw ApiError.badRequest('invalid csrf token')
    }
    try {
      const _accessTokenStart = performance.now()
      tokenRes = await req.wretchBase.formUrl({
        client_id: env['NETLIFY_CLIENT_ID'],
        client_secret: env['NETLIFY_CLIENT_SECRET'],
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `${req.origin}/api/auth/callback`
      }).url('https://api.netlify.com/oauth/token').post().json<{
        access_token : string
      }>()
      res.addServerTiming('accessToken', _accessTokenStart, performance.now())
    } catch (tokenErr) {
      throw new ApiError('failed to fetch access token from Netlify', tokenErr)
    }
    try {
      const _userStart = performance.now()
      userRes = await req.wretchNetlify.auth(`Bearer ${tokenRes.access_token}`).get('/user').json<TNUser>()
      res.addServerTiming('user', _userStart, performance.now())
    } catch (userErr) {
      throw new ApiError('failed to fetch user details from Netlify', userErr)
    }
    try {
      const _jwtStart = performance.now()
      jwt = await new EncryptJWT({
        email: userRes.email,
        nf_id: userRes.id,
        nf_token: tokenRes.access_token,
        zd_id: 0,
        zd_org: null
      } satisfies TJwtPayload).setExpirationTime(`${expTime}s`).setProtectedHeader({
        alg: 'dir',
        enc: 'A256CBC-HS512'
      }).encrypt(jwtSecret)
      res.addServerTiming('jwt', _jwtStart, performance.now())
      res.addServerTiming('handler', _handlerStart, performance.now())
      return res.setCookie('nf_token', jwt).redirect(`${req.origin}${parsedState.redirect_to}`)
    } catch (parseErr) {
      throw ApiError.internalServerError('failed to parse data', parseErr)
    }
  })
}