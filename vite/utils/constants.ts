import {ref} from 'vue'
import type {RouteLocationNormalizedLoaded} from 'vue-router'
import type {TNUser} from '~/types/global.ts'
import wretch from 'wretch'
import wretchAbort from 'wretch/addons/abort'
import wretchFormUrl from 'wretch/addons/formUrl'
import wretchQueryString from 'wretch/addons/queryString'
export const componentLoading = ref<boolean>(false)
export const nfUser = ref<null | TNUser>(null)
export const redirectTo = ref<null | Pick<RouteLocationNormalizedLoaded, 'name' | 'path'>>(null)
export const wretchBase = wretch('/api').addon(wretchAbort()).addon(wretchFormUrl).addon(wretchQueryString)