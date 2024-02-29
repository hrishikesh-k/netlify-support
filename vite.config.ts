import {defineConfig} from 'vite'
import {fileURLToPath} from 'node:url'
import type {Plugin} from 'vite'
import unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
function injectVueDevtools() : Plugin {
  return {
    name: 'inject-vue-devtools',
    transformIndexHtml: (html, ctx) => {
      if (ctx.server) {
        return [{
          attrs: {
            src: 'http://localhost:8098'
          },
          injectTo: 'head',
          tag: 'script'
        }]
      } else {
        return html
      }
    }
  }
}
export default defineConfig({
  build: {
    sourcemap: true,
    target: 'esnext'
  },
  esbuild: {
    legalComments: 'none'
  },
  plugins: [
    injectVueDevtools(),
    unocss(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => {
            return tag.includes('-')
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '~/client': fileURLToPath(new URL('./src/', import.meta.url)),
      '~/types': fileURLToPath(new URL('./@types/', import.meta.url))
    }
  }
})