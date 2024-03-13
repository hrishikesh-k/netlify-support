/// <reference types="vite/client"/>
import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb : {
      label : string
      level : number
      parent : null | string
    }
  }
}
export {}