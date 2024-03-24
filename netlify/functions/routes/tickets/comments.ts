import {ApiError} from '~/server/utils/functions.ts'
import {JSDOM} from 'jsdom'
import {jwtDecrypt} from 'jose'
import {jwtSecret} from '~/server/utils/constants.ts'
import {RouteTicketCommentsParams} from '~/types/request.ts'
import {routeTicketCommentsRes} from '~/types/response.ts'
import type {TFastifyTypebox, TTicketTokenJwtPayload} from '~/types/server.ts'
import type {TZComments} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/tickets/:id(^\\d+)/comments', {
    schema: {
      params: RouteTicketCommentsParams,
      response: {
        200: routeTicketCommentsRes
      }
    }
  }, async (req, res) => {
    const ticketToken = req.cookies[`nf_${req.params.id}_token`] || req.headers[`x-nf-${req.params.id}-token`] as string
    let ticketComments : TZComments['comments'] = []
    let ticketTokenDecrypted
    async function fetchZdComments(page : number = 1) {
      let zdCommentsRes
      try {
        zdCommentsRes = await req.wretchZendesk.query({
          sort_by: 'created_at',
          sort_order: 'desc'
        }).get(`/tickets/${req.params.id}/comments.json`).json<TZComments>()
      } catch (zdCommentsErr) {
        throw new ApiError('failed to fetch ticket comments from Zendesk', zdCommentsErr)
      }
      ticketComments = ticketComments.concat(zdCommentsRes.comments.filter(comment => {
        return comment.public
      }).map(filteredComment => {
          const fragment = JSDOM.fragment(filteredComment.html_body)
          fragment.querySelectorAll('*').forEach(subChild => {
            subChild.removeAttribute('dir')
            if (subChild.tagName === 'A') {
              subChild.setAttribute('target', '_blank')
            }
            if (subChild.classList.contains('collapse-signature') || subChild.classList.contains('signature') || subChild.tagName === 'BR') {
              subChild.remove()
            }
          })
          return {
            attachments: filteredComment.attachments,
            author_id: filteredComment.author_id,
            created_at: filteredComment.created_at,
            html_body: Array.from(fragment.children).map(child => {
              if (child.classList.contains('zd-comment')) {
                return child.innerHTML.trim()
              } else {
                return child.outerHTML.trim()
              }
            }).join(),
            id: filteredComment.id,
            public: filteredComment.public
          }
      }))
      if (zdCommentsRes.comments.length === 100) {
        return await fetchZdComments(page + 1)
      }
    }
    if (ticketToken) {
      try {
        ticketTokenDecrypted = await jwtDecrypt<TTicketTokenJwtPayload>(ticketToken, jwtSecret)
      } catch (ticketTokenDecryptErr) {
        throw ApiError.internalServerError('failed to decrypt ticket cookie', ticketTokenDecryptErr)
      }
    } else {
      throw ApiError.unauthorized('cookie missing')
    }
    if (ticketTokenDecrypted.payload.ticket_id === req.params.id) {
      await fetchZdComments()
      return res.send({
        comments: ticketComments,
        count: ticketComments.length
      })
    } else {
      throw ApiError.forbidden('ticket token mismatch')
    }
  })
}