import type {TRouteForumsTopicsRes, TRouteSystemStatusRes,TRouteTicketCommentsRes, TRouteTicketInfoRes, TRouteTicketListRes, TRouteUserInfoRes} from '~/types/response.ts'
export type TZAttachment = TRouteTicketCommentsRes['comments'][number]['attachments'][number]
export type TZComment = TRouteTicketCommentsRes['comments'][number]
export type TZComments = TRouteTicketCommentsRes
export type TDTopic = TRouteForumsTopicsRes[number]
export interface TDTopics {
  topic_list : {
    topics : Array<TDTopic>
  }
}
export interface TNAccount {
  id : string
  support_priority : TNUser['support_priority']
}
export type TNUser = TRouteUserInfoRes['netlify']
export type TSStatus = TRouteSystemStatusRes
interface TZPagination {
  count : number
}
export interface TZRelated {
  followup_source_ids : Array<number>
}
export type TZTicket = TRouteTicketInfoRes['ticket']
export type TZTickets = TRouteTicketListRes
export type TZUser = Required<TRouteUserInfoRes>['zendesk']
export interface TZUsers extends TZPagination {
  users : Array<TZUser>
}