import rollupPluginAlias from '@rollup/plugin-alias'
import rollupPluginCommonjs from '@rollup/plugin-commonjs'
import rollupPluginHtml from '@rollup/plugin-html'
import { nodeResolve as rollupPluginNodeResolve } from '@rollup/plugin-node-resolve'
import rollupPluginReplace from '@rollup/plugin-replace'
import rollupPluginCopy from 'rollup-plugin-copy'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginPostcss from 'rollup-plugin-postcss'
import { terser as rollupPluginTerser } from 'rollup-plugin-terser'
import rollupPluginTypescript2 from 'rollup-plugin-typescript2'
import { visualizer as rollupPluginVisualizer } from 'rollup-plugin-visualizer'
import createStyledComponentsTransformer from 'typescript-plugin-styled-components'

const styledComponentsTransformer = createStyledComponentsTransformer({
  minify: true
})
const distPath = process.env.IMGSTCKR_TEST ? 'dist/test' : 'dist/production'
const development = process.env.NODE_ENV === 'development'

export default [
  {
    input: 'src/background.ts',
    output: {
      file: `${distPath}/background.js`,
      format: 'iife',
      sourcemap: development ? 'hidden' : false
    },
    plugins: [
      rollupPluginAlias({
        entries: {
          '~': 'src'
        }
      }),
      rollupPluginCommonjs(),
      rollupPluginNodeResolve({
        browser: true
      }),
      rollupPluginReplace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      rollupPluginDelete({
        targets: [
          `${distPath}/background.js`,
          `${distPath}/background.js.map`,
          `${distPath}/_locales`,
          `${distPath}/images`,
          `${distPath}/manifest.json`
        ]
      }),
      rollupPluginTypescript2({
        inlineSourceMap: development
      }),
      rollupPluginTerser({
        format: {
          comments: false
        }
      }),
      rollupPluginVisualizer({
        gzipSize: true,
        filename: 'stats/background.html'
      }),

      // Settings for public files
      rollupPluginCopy({
        targets: [
          {
            src: 'public/_locales',
            dest: `${distPath}`
          },
          {
            src: 'public/images',
            dest: `${distPath}`
          },
          // Switch how to inject content_script.js
          {
            src: process.env.IMGSTCKR_TEST
              ? 'public/manifests/test.json'
              : 'public/manifests/production.json',
            dest: `${distPath}`,
            rename: 'manifest.json'
          }
        ]
      })
    ]
  },
  {
    input: 'src/default_popup.tsx',
    output: {
      file: `${distPath}/default_popup.js`,
      format: 'iife',
      sourcemap: development ? 'hidden' : false
    },
    plugins: [
      rollupPluginAlias({
        entries: {
          '~': 'src'
        }
      }),
      rollupPluginCommonjs(),
      rollupPluginNodeResolve({
        browser: true
      }),
      rollupPluginReplace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      rollupPluginDelete({
        targets: [
          `${distPath}/default_popup.js`,
          `${distPath}/default_popup.js.map`,
          `${distPath}/default_popup.html`
        ]
      }),
      rollupPluginTypescript2({
        inlineSourceMap: development,
        transformers: [
          () => ({
            before: [styledComponentsTransformer]
          })
        ]
      }),
      rollupPluginTerser({
        format: {
          comments: false
        }
      }),
      rollupPluginPostcss({
        minimize: true
      }),
      rollupPluginHtml({
        fileName: 'default_popup.html',
        title: 'Image Sticker'
      }),
      rollupPluginVisualizer({
        gzipSize: true,
        filename: 'stats/default_popup.html'
      })
    ]
  },
  {
    input: 'src/content_script.tsx',
    output: {
      file: `${distPath}/content_script.js`,
      format: 'iife',
      sourcemap: development ? 'hidden' : false
    },
    plugins: [
      rollupPluginAlias({
        entries: {
          '~': 'src'
        }
      }),
      rollupPluginCommonjs(),
      rollupPluginNodeResolve({
        browser: true
      }),
      rollupPluginReplace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      rollupPluginDelete({
        targets: [
          `${distPath}/content_script.js`,
          `${distPath}/content_script.js.map`
        ]
      }),
      rollupPluginTypescript2({
        inlineSourceMap: development,
        transformers: [
          () => ({
            before: [styledComponentsTransformer]
          })
        ]
      }),
      rollupPluginTerser({
        format: {
          comments: false
        }
      }),
      rollupPluginVisualizer({
        gzipSize: true,
        filename: 'stats/content_script.html'
      })
    ]
  }
]
