import {ref} from 'vue'
import type {RouteLocationNormalizedLoaded} from 'vue-router'
import type {TNUser, TZComments, TZUser} from '~/types/global.ts'
import wretch from 'wretch'
import wretchAbort from 'wretch/addons/abort'
import wretchFormUrl from 'wretch/addons/formUrl'
import wretchQueryString from 'wretch/addons/queryString'
export const componentLoading = ref<boolean>(false)
export const netlifyUser = ref<null | TNUser>(null)
export const redirectTo = ref<null | Pick<RouteLocationNormalizedLoaded, 'name' | 'path'>>(null)
export const ticketUsers = ref<null | TZComments['users']>(null)
export const wretchBase = wretch('/api').addon(wretchAbort()).addon(wretchFormUrl).addon(wretchQueryString)
export const zendeskUser = ref<null | TZUser | undefined>(null)