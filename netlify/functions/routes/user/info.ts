import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {expTime, jwtSecret} from '~/server/utils/constants.ts'
import {RouteUserInfoRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TNAccount, TNUser, TZUser, TZUsers} from '~/types/global.ts'
import type {TJwtPayload} from '~/types/server.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/user/info', {
    schema: {
      response: {
        200: RouteUserInfoRes
      }
    }
  }, async (req, res) => {
    let jwt
    let nfUserRes
    let nfSupportPriority = 0
    let zUserRes
    async function fetchNfAccounts(page = 1) {
      let nfAccountRes
      try {
        nfAccountRes = await req.wretchNetlify.query({
          page
        }).get('/accounts').json<Array<TNAccount>>()
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
      nfUserRes = await req.wretchNetlify.get('/user').json<TNUser>()
    } catch (nfUserErr) {
      throw new ApiError('failed to fetch user details from Netlify', nfUserErr)
    }
    await fetchNfAccounts()
    try {
      zUserRes = await req.wretchZendesk.query({
        query: `type:user email:${req.nfToken.email}`
      }).get('/users/search.json').json<TZUsers>()
    } catch (zUserErr) {
      throw new ApiError('failed to search user by email on Zendesk', zUserErr)
    }
    if (zUserRes.users.length) {
      zUserRes = zUserRes.users[0]
    } else {
      try {
        zUserRes = await req.wretchZendesk.post({
          user: {
            email: req.nfToken.email,
            external_id: req.nfToken.nf_id,
            name: nfUserRes.full_name,
            verified: true
          }
        }, '/users.json').json<TZUser>()
      } catch (zUserErr) {
        throw new ApiError('failed to create user on Zendesk', zUserErr)
      }
    }
    try {
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
    } catch (jwtErr) {
      throw ApiError.internalServerError('failed to encrypt JWT', jwtErr)
    }
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
        role: zUserRes.role
      }
    })
  })
}