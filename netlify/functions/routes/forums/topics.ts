import {ApiError} from '~/server/utils/functions.ts'
import {performance} from 'node:perf_hooks'
import {RouteForumsTopicsQuery} from '~/types/request.ts'
import {routeForumsTopicsRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TDTopics} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/forums/topics', {
    schema: {
      querystring: RouteForumsTopicsQuery,
      response: {
        200: routeForumsTopicsRes
      }
    }
  }, async (req, res) => {
    const _handlerStart = performance.now()
    let topicsRes
    if (req.query.type === 'latest') {
      req.wretchDiscourse = req.wretchDiscourse.query({
        order: 'created'
      }).url('/latest.json')
    } else if (req.query.type === 'top') {
      req.wretchDiscourse = req.wretchDiscourse.query({
        period: 'monthly'
      }).url('/top.json')
    }
    try {
      const _topicsStart = performance.now()
      topicsRes = await req.wretchDiscourse.get().json<TDTopics>()
      res.addServerTiming('topics', _topicsStart, performance.now())
    } catch (topicErr) {
      throw new ApiError('failed to fetch posts from Discourse', topicErr)
    }
    res.addServerTiming('handler', _handlerStart, performance.now())
    return res.send(topicsRes.topic_list.topics.filter(topic => {
      return topic.category_id === 48
    }).map(filteredTopic => {
      return {
        category_id: filteredTopic.category_id,
        has_accepted_answer: filteredTopic.has_accepted_answer,
        id: filteredTopic.id,
        reply_count: filteredTopic.reply_count,
        title: filteredTopic.title,
        views: filteredTopic.views
      }
    }))
  })
}