import type {TFastifyTypebox} from '~/types/server.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/auth/logout', async (req, res) => {
    return res.clearCookie('nf_token').redirect(req.origin)
  })
}