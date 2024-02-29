import {ApiError} from '~/server/utils/functions.ts'
import {RouteForumsTopicsQuery} from '~/types/request.ts'
import {RouteForumsTopicsRes} from '~/types/response.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import type {TDTopics} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/forums/topics', {
    schema: {
      querystring: RouteForumsTopicsQuery,
      response: {
        200: RouteForumsTopicsRes
      }
    }
  }, async (req, res) => {
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
      topicsRes = await req.wretchDiscourse.get().json<TDTopics>()
    } catch (topicErr) {
      throw new ApiError('failed to fetch posts from Discourse', topicErr)
    }
    return res.send(topicsRes.topic_list.topics.filter(topic => {
      return topic.category_id === 48
    }).map(filteredTopic => {
      return {
        has_accepted_answer: filteredTopic.has_accepted_answer,
        id: filteredTopic.id,
        reply_count: filteredTopic.reply_count,
        title: filteredTopic.title,
        views: filteredTopic.views
      }
    }))
  })
}