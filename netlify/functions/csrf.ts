import type {Config} from '@netlify/functions'
import {getStore} from '@netlify/blobs'
export default async () => {
  let deletedCount = 0
  console.info('function csrf invoked')
  const csrfStore = getStore('csrf_store')
  const csrfTokens = await csrfStore.list()
  console.info(`listed ${csrfTokens.blobs.length} tokens`)
  for (const csrfBlob of csrfTokens.blobs) {
    await csrfStore.delete(csrfBlob.key)
    deletedCount++
  }
  console.info(`${deletedCount} token(s) deleted`)
}
export const config : Config = {
  schedule: '@daily'
}