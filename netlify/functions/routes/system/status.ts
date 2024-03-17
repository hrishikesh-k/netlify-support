import {ApiError} from '~/server/utils/functions.ts'
import {routeSystemStatusRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TSStatus} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/system/status', {
    schema: {
      response: {
        200: routeSystemStatusRes
      }
    }
  }, async (req, res) => {
    let statusRes
    try {
      statusRes = await req.wretchBase.url('https://www.netlifystatus.com/api/v2/summary.json').get().json<TSStatus>()
    } catch (statusErr) {
      throw new ApiError('failed to fetch data from Statuspage', statusErr)
    }
    return res.send(statusRes)
  })
}