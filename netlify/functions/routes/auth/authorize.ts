import {env} from 'node:process'
import {RouteAuthAuthorizeQuery} from '~/types/request.ts'
import type {TFastifyTypebox} from '~/types/server.ts'
import {stringify} from 'qs'
export default function (api : TFastifyTypebox) {
  return api.get('/auth/authorize', {
    schema: {
      querystring: RouteAuthAuthorizeQuery
    }
  }, async (req, res) => {
    return res.redirect(`https://app.netlify.com/authorize?${stringify({
      client_id: env['NETLIFY_CLIENT_ID'],
      redirect_uri: `${req.origin}/api/auth/callback`,
      response_type: 'code',
      state: stringify({
        csrf: req.query.csrf,
        path: req.query.path || '/'
      })
    })}`)
  })
}