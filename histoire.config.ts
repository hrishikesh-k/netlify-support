import {defineConfig} from 'histoire'
import {HstVue} from '@histoire/plugin-vue'
import MarkdownItFootnote from 'markdown-it-footnote'
export default defineConfig({
  plugins: [
    HstVue()
  ],
  markdown: md => {
    return md.use(MarkdownItFootnote)
  },
  setupFile: './histoire.setup.ts',
  vite: {
    build: {
      sourcemap: false
    }
  }
})