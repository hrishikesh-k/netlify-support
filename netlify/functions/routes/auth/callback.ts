import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {env} from 'node:process'
import {expTime, jwtSecret} from '~/server/utils/constants.ts'
import {parse} from 'qs'
import {RouteAuthCallbackQuery} from '~/types/request.ts'
import {RouteAuthCallbackRes} from '~/types/response'
import type {TFastifyTypebox, TJwtPayload} from '~/types/server.ts'
import type {TNUser} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/auth/callback', {
    schema: {
      querystring: RouteAuthCallbackQuery,
      response: {
        200: RouteAuthCallbackRes
      }
    }
  }, async (req, res) => {
    let jwt
    let tokenRes
    let userRes
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
      const parsedQuery = parse(req.query.state) as {
        csrf : string
        path : string
      }
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
      return res.setCookie('nf_token', jwt).redirect(`${req.origin}${parsedQuery.path}?csrf=${parsedQuery.csrf}`)
    } catch (parseErr) {
      throw ApiError.internalServerError('failed to parse data', parseErr)
    }
  })
}