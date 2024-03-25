import {ApiError} from '~/server/utils/functions.ts'
import {env} from 'node:process'
import {JSDOM} from 'jsdom'
import {jwtDecrypt} from 'jose'
import {jwtSecret} from '~/server/utils/constants.ts'
import {performance} from 'node:perf_hooks'
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
    const _handlerStart = performance.now()
    const ticketToken = req.cookies[`nf_${req.params.id}_token`] || req.headers[`x-nf-${req.params.id}-token`] as string
    let ticketComments : TZComments['comments'] = []
    let ticketTokenDecrypted
    let ticketUsers : TZComments['users'] = []
    async function fetchZdComments(page : number = 1) {
      let zdCommentsRes
      try {
        const _zdCommentsStart = performance.now()
        zdCommentsRes = await req.wretchZendesk.query({
          include: 'users',
          sort_by: 'created_at',
          sort_order: 'desc'
        }).get(`/tickets/${req.params.id}/comments.json`).json<TZComments>()
        res.addServerTiming(`comments-page-${page}`, _zdCommentsStart, performance.now())
      } catch (zdCommentsErr) {
        throw new ApiError('failed to fetch ticket comments from Zendesk', zdCommentsErr)
      }
      ticketComments = ticketComments.concat(zdCommentsRes.comments.filter(comment => {
        return comment.public
      }).map(filteredComment => {
          const _jsDomStart = performance.now()
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
          res.addServerTiming(`jsDom-page-${page}`, _jsDomStart, performance.now())
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
      zdCommentsRes.users.forEach(user => {
        if (!ticketUsers.find(ticketUser => {
          return ticketUser.id === user.id
        }) && user.email !== env['ZENDESK_USERNAME']) {
          ticketUsers.push({
            email: user.email,
            id: user.id,
            name: user.name,
            organization_id: user.organization_id,
            role: user.role
          })
        }
      })
      if (zdCommentsRes.comments.length === 100) {
        return await fetchZdComments(page + 1)
      }
    }
    if (ticketToken) {
      try {
        const _ticketTokenStart = performance.now()
        ticketTokenDecrypted = await jwtDecrypt<TTicketTokenJwtPayload>(ticketToken, jwtSecret)
        res.addServerTiming('ticketToken', _ticketTokenStart, performance.now())
      } catch (ticketTokenDecryptErr) {
        throw ApiError.internalServerError('failed to decrypt ticket cookie', ticketTokenDecryptErr)
      }
    } else {
      throw ApiError.unauthorized('cookie missing')
    }
    if (ticketTokenDecrypted.payload.ticket_id === req.params.id) {
      await fetchZdComments()
      res.addServerTiming('handler', _handlerStart, performance.now())
      return res.send({
        comments: ticketComments,
        users: ticketUsers,
        count: ticketComments.length
      })
    } else {
      throw ApiError.forbidden('ticket token mismatch')
    }
  })
}