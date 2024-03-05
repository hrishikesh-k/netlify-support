import {defineConfig} from 'unocss'
import presetUno from '@unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'
export default defineConfig({
  blocklist: [
    'contents'
  ],
  presets: [
    presetUno({
      arbitraryVariants: true,
      attributifyPseudo: false,
      dark: 'class',
      variablePrefix: 'u-'
    })
  ],
  theme: {
    colors: {
      blue: {
        '000': '#edf4ff',
        '100': '#cde2ff',
        '200': '#b5d2fb',
        '300': '#9cbef6',
        '400': '#80abfa',
        '500': '#5d8df5',
        '600': '#316bf4',
        '700': '#2e51ed',
        '800': '#2036a1',
        '900': '#1b205b'
      },
      green: {
        '000': '#e7fce9',
        '100': '#bef9c6',
        '200': '#93f5a5',
        '300': '#64d87f',
        '400': '#3ac364',
        '500': '#31a855',
        '600': '#228240',
        '700': '#1a6b34',
        '800': '#0f4a21',
        '900': '#152a19',
      },
      gold: {
        '000': '#fdf5d8',
        '100': '#f6e0a5',
        '200': '#facd6f',
        '300': '#fbb13d',
        '400': '#f98e21',
        '500': '#d5771a',
        '600': '#a85d13',
        '700': '#8c4c0d',
        '800': '#603408',
        '900': '#332213'
      },
      neutral: {
        '000': '#ffffff',
        '100': '#f6f6f7',
        '200': '#e9ebed',
        '300': '#d1d5da',
        '400': '#9da7b2',
        '500': '#778089',
        '600': '#545a61',
        '700': '#353a3e',
        '800': '#181a1a',
        '900': '#060b10'
      },
      pink: {
        '000': '#fcf0fb',
        '100': '#f6d2f2',
        '200': '#f7bcf3',
        '300': '#f3a8ee',
        '400': '#ef7feb',
        '500': '#df5adc',
        '600': '#b938b8',
        '700': '#9a2d99',
        '800': '#6c1d6b',
        '900': '#381b37'
      },
      purple: {
        '000': '#f5f2fc',
        '100': '#e2d9f7',
        '200': '#d8c7ff',
        '300': '#cab9f4',
        '400': '#b49df1',
        '500': '#9b80ed',
        '600': '#775ce7',
        '700': '#614aca',
        '800': '#382aa4',
        '900': '#292142'
      },
      red: {
        '000': '#fbeeed',
        '100': '#fbd3d0',
        '200': '#ffbdba',
        '300': '#ffada9',
        '400': '#fe8382',
        '500': '#fe4e5c',
        '600': '#d62740',
        '700': '#af2536',
        '800': '#800a20',
        '900': '#3d1c1b'
      },
      teal: {
        '000': '#defffe',
        '100': '#8efbf7',
        '200': '#32e6e2',
        '300': '#14d8d4',
        '400': '#05bdba',
        '500': '#04a29f',
        '600': '#02807d',
        '700': '#016968',
        '800': '#014847',
        '900': '#0c2a2a'
      }
    },
    fontFamily: {
      mulish: '\'Mulish\', sans-serif'
    },
    preflightRoot: '*'
  },
  transformers: [
    transformerDirectives({
      applyVariable: ['--u-apply']
    })
  ]
})