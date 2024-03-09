import type {Config} from '@netlify/functions'
import {getStore} from '@netlify/blobs'
export default async (req : Request) => {
  const csrfStore = getStore('csrf_store')
  const csrfTokens = await csrfStore.list()
  for (const csrfBlob in csrfTokens.blobs) {
    await csrfStore.delete(csrfBlob.key)
  }
}
export const config: Config = {
  schedule: '@daily'
}