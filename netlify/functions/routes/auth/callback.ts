import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {env} from 'node:process'
import {expTime, jwtSecret} from '~/server/utils/constants.ts'
import {parse} from 'qs'
import {RouteAuthCallbackQuery} from '~/types/request.ts'
import {RouteAuthCallbackRes} from '~/types/response'
import type {TFastifyTypebox, TJwtPayload} from '~/types/server.ts'
import type {TNUser} from '~/types/global.ts'
import {getStore} from "@netlify/blobs";
export default function (api : TFastifyTypebox) {
  return api.get('/auth/callback', {
    schema: {
      querystring: RouteAuthCallbackQuery,
      response: {
        200: RouteAuthCallbackRes
      }
    }
  }, async (req, res) => {
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
      csrfBlob = await csrfStore.get(parsedState.csrf, {
        type: 'json'
      })
    } catch (csrfBlobErr) {
      throw ApiError.internalServerError('failed to query csrf store', csrfBlobErr)
    }
    if (csrfBlob) {
      try {
        await csrfStore.delete(parsedState.csrf)
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
      tokenRes = await req.wretchBase.formUrl({
        client_id: env['NETLIFY_CLIENT_ID'],
        client_secret: env['NETLIFY_CLIENT_SECRET'],
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `${req.origin}/api/auth/callback`
      }).url('https://api.netlify.com/oauth/token').post().json<{
        access_token : string
      }>()
    } catch (tokenErr) {
      throw new ApiError('failed to fetch access token from Netlify', tokenErr)
    }
    try {
      userRes = await req.wretchNetlify.auth(`Bearer ${tokenRes.access_token}`).get('/user').json<TNUser>()
    } catch (userErr) {
      throw new ApiError('failed to fetch user details from Netlify', userErr)
    }
    try {
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
      return res.setCookie('nf_token', jwt).redirect(`${req.origin}${parsedState.redirect_to}`)
    } catch (parseErr) {
      throw ApiError.internalServerError('failed to parse data', parseErr)
    }
  })
}