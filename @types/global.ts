const sStatusDescription = [
  'All Systems Operational',
  'Major System Outage',
  'Minor Service Outage',
  'Partial System Outage',
  'Partially Degraded Service',
  'Service Under Maintenance'
] as const
const sStatusIndicator = [
  'critical',
  'maintenance',
  'major',
  'minor',
  'none'
] as const
const zTicketStatus = [
  'closed',
  'hold',
  'new',
  'open',
  'pending',
  'solved'
] as const
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
export interface TDTopic {
  category_id : number
  has_accepted_answer : boolean
  id : number
  reply_count : number
  title : string
  views : number
}
export interface TDTopics {
  topic_list : {
    topics : Array<TDTopic>
  }
}
export interface TNAccount {
  id : string
  support_priority : number
}
export interface TNUser {
  avatar_url : string
  email : string
  full_name : string
  id : string
  support_priority : number
}
export interface TSStatus {
  page : {
    url : string
  }
  status : {
    description : typeof sStatusDescription[number]
    indicator : typeof sStatusIndicator[number]
  }
}
interface TZPagination {
  count : number
}
export interface TZRelated {
  followup_source_ids : Array<number>
}
export interface TZTicket {
  created_at : string
  follower_ids : Array<number>
  followup_ids : Array<number>
  id : number
  organization_id : null | number
  requester_id : number
  status : typeof zTicketStatus[number]
  subject : string
  updated_at : string
}
export interface TZTickets extends TZPagination {
  tickets : Array<TZTicket>
}
export interface TZUser {
  email : string
  id : number
  name : string
  organization_id : null | number
  role : 'admin' | 'agent' | 'end-user'
}
export interface TZUsers extends TZPagination {
  users : Array<TZUser>
}