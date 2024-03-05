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
        redirect_to: req.query.redirect_to
      }, {
        encode: false
      })
    })}`)
  })
}

// https://app.netlify.com/authorize?client_id=d842UWdDPv8uVZteP2mp-ELI_ZGyoZJbiIzt5jApaPY&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fauth%2Fcallback&response_type=code&state%5Bcsrf%5D=12345&state%5Bredirect_to%5D=%2Fdashboard
// https://app.netlify.com/authorize?client_id=d842UWdDPv8uVZteP2mp-ELI_ZGyoZJbiIzt5jApaPY&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fauth%2Fcallback&response_type=code&state=0=12345&1=%2F