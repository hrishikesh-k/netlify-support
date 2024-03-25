import {ApiError} from '~/server/utils/functions.ts'
import {performance} from 'node:perf_hooks'
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
    const _handlerStart = performance.now()
    let statusRes
    try {
      const _statusStart = performance.now()
      statusRes = await req.wretchBase.url('https://www.netlifystatus.com/api/v2/summary.json').get().json<TSStatus>()
      res.addServerTiming('status', _statusStart, performance.now())
    } catch (statusErr) {
      throw new ApiError('failed to fetch data from Statuspage', statusErr)
    }
    res.addServerTiming('handler', _handlerStart, performance.now())
    return res.send(statusRes)
  })
}