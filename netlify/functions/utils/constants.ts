import {env} from 'node:process'
import {Array, Integer, Literal, Null, Object, String, Union} from '@sinclair/typebox'
export const expTime = 60 * 60 * 24
export const jwtSecret = new TextEncoder().encode(env['JWT_SECRET'])
export const logLevels = [
  'debug',
  'error',
  'fatal',
  'info',
  'silent',
  'trace',
  'warn'
] as const
export const typeboxEmail = String({
  format: 'email'
})
export const typeboxZdTicket = Object({
  created_at: String({
    format: 'date-time'
  }),
  follower_ids: Array(Integer()),
  followup_ids: Array(Integer()),
  id: Integer(),
  organization_id: Union([
    Null(),
    Integer()
  ]),
  requester_id: Integer(),
  status: Union([
    Literal('closed'),
    Literal('hold'),
    Literal('new'),
    Literal('open'),
    Literal('pending'),
    Literal('solved')
  ]),
  subject: String(),
  updated_at: String({
    format: 'date-time'
  })
})
export const typeboxZdUser = Object({
  email: typeboxEmail,
  id: Integer(),
  name: String(),
  organization_id: Integer(),
  role: Union([
    Literal('admin'),
    Literal('agent'),
    Literal('end-user')
  ])
})