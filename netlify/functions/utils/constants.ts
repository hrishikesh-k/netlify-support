import {env} from 'node:process'
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