import {defineSetupVue3} from '@histoire/plugin-vue'
import LWrapper from '~/client/layouts/l-wrapper.vue'
import 'virtual:uno.css'
export const setupVue3 = defineSetupVue3(histoireInstance => {
  histoireInstance.addWrapper(LWrapper)
})