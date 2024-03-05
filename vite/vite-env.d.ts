/// <reference types="@histoire/plugin-vue/components"/>
/// <reference types="vite/client"/>
import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    skipAuth? : boolean
  }
}
export {}