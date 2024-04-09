import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {expTime, jwtSecret} from '~/server/utils/constants.ts'
import {performance} from 'node:perf_hooks'
import {routeUserInfoRes, type TRouteUserInfoRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TJwtPayload} from '~/types/server.ts'
import type {TNAccount, TNUser, TZUser, TZUsers} from '~/types/global.ts'
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
    let jwtPayload : TJwtPayload = {
      netlify: req.user.netlify
    }
    let nfUserRes
    let nfSupportPriority : TRouteUserInfoRes['netlify']['support_priority'] = 0
    let resPayload : TRouteUserInfoRes = {
      netlify: {
        email: '',
        avatar_url: '',
        full_name: '',
        id: '',
        support_priority: 0
      }
    }
    let zUser : TZUser
    let zUsers : TZUsers
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
        return Math.max(currentSp, currentAccount.support_priority) as TRouteUserInfoRes['netlify']['support_priority']
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
    resPayload.netlify = {
      avatar_url: nfUserRes.avatar_url,
      email: nfUserRes.email,
      full_name: nfUserRes.full_name,
      id: nfUserRes.id,
      support_priority: nfSupportPriority
    }
    try {
      const _zUserIdSearchStart = performance.now()
      zUsers = await req.wretchZendesk.query({
        query: `type:user external_id:${req.user.netlify.id}`
      }).get('/users/search.json').json<TZUsers>()
      res.addServerTiming('zUserIdSearch', _zUserIdSearchStart, performance.now())
    } catch (zUserIdErr) {
      throw new ApiError('failed to search user by id on Zendesk', zUserIdErr)
    }
    if (zUsers.count === 0) {
      try {
        const _zUserEmailSearchStart = performance.now()
        zUsers = await req.wretchZendesk.query({
          query: `type:user email:${req.user.netlify.email}`
        }).get('/users/search.json').json<TZUsers>()
        res.addServerTiming('zUserEmailSearch', _zUserEmailSearchStart, performance.now())
      } catch (zUserEmailErr) {
        throw new ApiError('failed to search user by email on Zendesk', zUserEmailErr)
      }
      if (zUsers.count === 0) {
        throw ApiError.notFound('no user found')
      } else if (zUsers.count === 1) {
        zUser = zUsers.users[0]
      } else {
        throw ApiError.conflict('too many users with same email')
      }
    }
    if (zUsers.count === 1) {
      zUser = zUsers.users[0]
    } else {
      throw ApiError.conflict('too many users with same ID')
    }
    if (zUser) {
      if (zUser.photo) {
        zUser.photo = {
          content_url: zUser.photo.content_url
        }
      } else {
        zUser.photo = null
      }
      jwtPayload.zendesk = {
        email: zUser.email,
        id: zUser.id,
        org: zUser.organization_id
      }
      resPayload.zendesk = {
        email: zUser.email,
        id: zUser.id,
        name: zUser.name,
        organization_id: zUser.organization_id,
        photo: zUser.photo,
        remote_photo_url: zUser.remote_photo_url,
        role: zUser.role
      }
    }
    try {
      const _jwtStart = performance.now()
      jwt = await new EncryptJWT(jwtPayload satisfies TJwtPayload).setExpirationTime(`${expTime}s`).setProtectedHeader({
        alg: 'dir',
        enc: 'A256CBC-HS512'
      }).encrypt(jwtSecret)
      res.addServerTiming('jwtUser', _jwtStart, performance.now())
    } catch (jwtErr) {
      throw ApiError.internalServerError('failed to encrypt JWT', jwtErr)
    }
    res.addServerTiming('handler', _handlerStart, performance.now())
    return res.setCookie('nf_token', jwt).send(resPayload)
  })
}