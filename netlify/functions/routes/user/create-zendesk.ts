import {ApiError} from '~/server/utils/functions.ts'
import {performance} from 'node:perf_hooks'
import {routeUserCreateZendeskBody} from '~/types/request.ts'
import {routeUserInfoRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TZUser} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.post('/user/create', {
    schema: {
      body: routeUserCreateZendeskBody,
      response: {
        200: routeUserInfoRes
      }
    }
  }, async (req, res) => {
    const _handlerStart = performance.now()
    let zUserRes
    try {
      const _zUserCreateStart = performance.now()
      zUserRes = await req.wretchZendesk.post({
        user: {
          email: req.user.netlify.email,
          external_id: req.user.netlify.id,
          name: req.body.name,
          remote_photo_url: req.body.photo,
          verified: true
        }
      }, '/users.json').json<TZUser>()
      res.addServerTiming('zUserCreate', _zUserCreateStart, performance.now())
    } catch (zUserErr) {
      throw new ApiError('failed to create user on Zendesk', zUserErr)
    }
    if (zUserRes) {

    }
    res.addServerTiming('handler', _handlerStart, performance.now())
  })
}