import type {TRouteForumsTopicsRes, TRouteSystemStatusRes, TRouteTicketInfoRes, TRouteTicketListRes, TRouteUserInfoRes} from '~/types/response.ts'
export interface TZComment {
  attachments : Array<{
  }>
  author_id : number
  created_at : string
  html_body : string
  id : number
  public : boolean
}
export interface TZComments extends TZPagination {
  comments : Array<TZComment>
}
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
export type TNUser = TRouteUserInfoRes['nf']
export type TSStatus = TRouteSystemStatusRes
interface TZPagination {
  count : number
}
export interface TZRelated {
  followup_source_ids : Array<number>
}
export type TZTicket = TRouteTicketInfoRes['ticket']
export type TZTickets = TRouteTicketListRes
export type TZUser = TRouteUserInfoRes['zd']
export interface TZUsers extends TZPagination {
  users : Array<TZUser>
}