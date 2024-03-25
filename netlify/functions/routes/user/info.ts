import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {expTime, jwtSecret} from '~/server/utils/constants.ts'
import {performance} from 'node:perf_hooks'
import {routeUserInfoRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TNAccount, TNUser, TZUser, TZUsers} from '~/types/global.ts'
import type {TJwtPayload} from '~/types/server.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/user/info', {
    schema: {
      response: {
        200: routeUserInfoRes
      }
    }
  }, async (req, res) => {
    const _handlerStart = performance.now()
    let jwt
    let nfUserRes
    let nfSupportPriority = 0
    let zUserRes
    async function fetchNfAccounts(page = 1) {
      let nfAccountRes
      try {
        const _accountStart = performance.now()
        nfAccountRes = await req.wretchNetlify.query({
          page
        }).get('/accounts').json<Array<TNAccount>>()
        res.addServerTiming(`accounts-page-${page}`, _accountStart, performance.now())
      } catch (nfAccountErr) {
        throw new ApiError('failed to fetch account details from Netlify', nfAccountErr)
      }
      nfSupportPriority = nfAccountRes.reduce((currentSp, currentAccount) => {
        return Math.max(currentSp, currentAccount.support_priority)
      }, nfSupportPriority)
      if (nfAccountRes.length === 100) {
        return await fetchNfAccounts(page + 1)
      }
    }
    try {
      const _nfUserStart = performance.now()
      nfUserRes = await req.wretchNetlify.get('/user').json<TNUser>()
      res.addServerTiming('nfUser', _nfUserStart, performance.now())
    } catch (nfUserErr) {
      throw new ApiError('failed to fetch user details from Netlify', nfUserErr)
    }
    await fetchNfAccounts()
    try {
      const _zUserSearchStart = performance.now()
      zUserRes = await req.wretchZendesk.query({
        query: `type:user email:${req.nfToken.email}`
      }).get('/users/search.json').json<TZUsers>()
      res.addServerTiming('zUserSearch', _zUserSearchStart, performance.now())
    } catch (zUserErr) {
      throw new ApiError('failed to search user by email on Zendesk', zUserErr)
    }
    if (zUserRes.users.length) {
      zUserRes = zUserRes.users[0]
    } else {
      try {
        const _zUserCreateStart = performance.now()
        zUserRes = await req.wretchZendesk.post({
          user: {
            email: req.nfToken.email,
            external_id: req.nfToken.nf_id,
            name: nfUserRes.full_name,
            verified: true
          }
        }, '/users.json').json<TZUser>()
        res.addServerTiming('zUserCreate', _zUserCreateStart, performance.now())
      } catch (zUserErr) {
        throw new ApiError('failed to create user on Zendesk', zUserErr)
      }
    }
    if (zUserRes.photo) {
      zUserRes.photo = {
        content_url: zUserRes.photo.content_url
      }
    } else {
      zUserRes.photo = null
    }
    try {
      const _jwtStart = performance.now()
      jwt = await new EncryptJWT({
        email: req.nfToken.email,
        nf_id: req.nfToken.nf_id,
        nf_token: req.nfToken.nf_token,
        zd_id: zUserRes.id,
        zd_org: zUserRes.organization_id
      } satisfies TJwtPayload).setExpirationTime(`${expTime}s`).setProtectedHeader({
        alg: 'dir',
        enc: 'A256CBC-HS512'
      }).encrypt(jwtSecret)
      res.addServerTiming('jwtUser', _jwtStart, performance.now())
    } catch (jwtErr) {
      throw ApiError.internalServerError('failed to encrypt JWT', jwtErr)
    }
    res.addServerTiming('handler', _handlerStart, performance.now())
    return res.setCookie('nf_token', jwt).send({
      nf: {
        avatar_url: nfUserRes.avatar_url,
        email: nfUserRes.email,
        full_name: nfUserRes.full_name,
        id: nfUserRes.id,
        support_priority: nfSupportPriority
      },
      zd: {
        email: zUserRes.email,
        id: zUserRes.id,
        name: zUserRes.name,
        organization_id: zUserRes.organization_id,
        photo: zUserRes.photo,
        role: zUserRes.role
      }
    })
  })
}