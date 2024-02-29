import {ApiError} from '~/server/utils/functions.ts'
import {EncryptJWT} from 'jose'
import {jwtSecret} from '~/server/utils/constants.ts'
import {RouteTicketsInfoParams} from '~/types/request.ts'
import {RouteTicketsInfoRes} from '~/types/response.ts'
import type {TFastifyTypebox, TTicketTokenJwtPayload} from '~/types/server.ts'
import type {TZRelated, TZTicket,  TZUsers} from '~/types/global.ts'
export default function (api : TFastifyTypebox) {
  return api.get('/tickets/:id(^\\d+)/info', {
    schema: {
      params: RouteTicketsInfoParams,
      response: {
        200: RouteTicketsInfoRes
      }
    }
  }, async (req, res) => {
    let followersRes
    let relatedRes
    let ticketJwt
    let ticketRes
    let ticketDetailsRes
    let userType : TTicketTokenJwtPayload['user_type']
    async function getFollowers() {
      try {
        followersRes = await req.wretchZendesk.get(`/tickets/${req.params.id}/followers.json`).json<TZUsers>()
      } catch (followerErr) {
        throw new ApiError('failed to fetch ticket follower details from Zendesk', followerErr)
      }
      return followersRes.users.map(follower => {
        return {
          email: follower.email,
          id: follower.id,
          name: follower.name,
          organization_id: follower.organization_id,
          role: follower.role
        }
      })
    }
    async function getRelated() {
      try {
        relatedRes = await req.wretchZendesk.get(`/tickets/${req.params.id}/related.json`).json<{
          ticket_related : TZRelated
        }>()
      } catch (relatedErr) {
        throw new ApiError('failed to fetch ticket relation details from Zendesk', relatedErr)
      }
      return relatedRes.ticket_related.followup_source_ids
    }
    async function getTicket() {
      try {
        ticketRes = await req.wretchZendesk.get(`/tickets/${req.params.id}.json`).json<{
          ticket : TZTicket
        }>()
      } catch (ticketErr) {
        throw new ApiError('failed to fetch ticket details from Zendesk', ticketErr)
      }
      return {
        created_at: ticketRes.ticket.created_at,
        follower_ids: ticketRes.ticket.follower_ids,
        followup_ids: ticketRes.ticket.followup_ids,
        id: ticketRes.ticket.id,
        organization_id: ticketRes.ticket.organization_id,
        requester_id: ticketRes.ticket.requester_id,
        status: ticketRes.ticket.status,
        subject: ticketRes.ticket.subject,
        updated_at: ticketRes.ticket.updated_at
      }
    }
    ticketDetailsRes = await Promise.all([
      await getFollowers(),
      await getRelated(),
      await getTicket()
    ])
    if (ticketDetailsRes[2].requester_id === req.nfToken.zd_id) {
      userType = 'requester'
    } else if (ticketDetailsRes[2].organization_id === req.nfToken.zd_org) {
      userType = 'organization'
    } else if (ticketDetailsRes[0].some(follower => {
      return follower.id === req.nfToken!.zd_id
    })) {
      userType = 'follower'
    } else if (req.nfToken.email.endsWith('@netlify.com')) {
      userType = 'netlify'
    }
    if (userType) {
      try {
        ticketJwt = await new EncryptJWT({
          ticket_id: req.params.id,
          user_type: userType
        } satisfies TTicketTokenJwtPayload).setExpirationTime('3600s').setProtectedHeader({
          alg: 'dir',
          enc: 'A256CBC-HS512'
        }).encrypt(jwtSecret)
      } catch (ticketJwtErr) {
        throw ApiError.internalServerError('failed to encrypt data', ticketJwtErr)
      }
      return res.setCookie(`nf_${req.params.id}_token`, ticketJwt, {
        maxAge: 3600,
        path: `/api/tickets/${req.params.id}/`
      }).send({
        followers: ticketDetailsRes[0],
        related: ticketDetailsRes[1],
        ticket: ticketDetailsRes[2]
      })
    } else {
      throw ApiError.forbidden('user not part of the ticket')
    }
  })
}