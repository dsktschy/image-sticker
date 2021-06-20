import rollupPluginAlias from '@rollup/plugin-alias'
import rollupPluginCommonjs from '@rollup/plugin-commonjs'
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

const development = process.env.NODE_ENV === 'development'

/**
 * Output Directory Path
 *
 * Expected behaviour of content script can't be gotten
 * without content_script settings in manifest.json
 * because of following reasons
 * - executeScript of extension fails on puppeteer
 * - chrome(browser).runtime is undefined
 *   in content script injected by addScriptTag of puppeteer
 * So create artifact for test in dist/test
 */
const outputDirPath = process.env.IMGSTCKR_TEST
  ? 'dist/test'
  : 'dist/production'

export default [
  /**
   * Vendor
   *
   * For parallel requests and long term caching
   * provide common packages to other entry points as global variables
   * because code splitting doesn't support iife format
   * https://github.com/rollup/rollup/issues/2072
   */
  {
    input: 'src/vendor.ts',
    output: {
      file: `${outputDirPath}/vendor.js`,
      format: 'iife',
      sourcemap: development ? 'hidden' : false,
      // Store exported value to window.imgstckr
      name: 'imgstckr'
    },
    plugins: [
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
          `${outputDirPath}/vendor.js`,
          `${outputDirPath}/vendor.js.map`
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
        filename: 'stats/vendor.html'
      })
    ]
  },

  /**
   * Background
   *
   * Settings for public files are also written here
   */
  {
    input: 'src/background.ts',
    output: {
      file: `${outputDirPath}/background.js`,
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
          `${outputDirPath}/background.js`,
          `${outputDirPath}/background.js.map`,

          // Settings for public files
          `${outputDirPath}/_locales`,
          `${outputDirPath}/images`,
          `${outputDirPath}/manifest.json`,
          `${outputDirPath}/default_popup.html`
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
            dest: outputDirPath
          },
          {
            src: 'public/images',
            dest: outputDirPath
          },
          {
            src: 'public/default_popup.html',
            dest: outputDirPath
          },
          // Switch how to inject content_script.js
          {
            src: process.env.IMGSTCKR_TEST
              ? 'public/manifests/test.json'
              : 'public/manifests/production.json',
            dest: outputDirPath,
            rename: 'manifest.json'
          }
        ]
      })
    ]
  },

  /**
   * Default Popup
   *
   * Import common packages from vendor as global variables because of iife format
   */
  {
    input: 'src/default_popup.tsx',
    output: {
      file: `${outputDirPath}/default_popup.js`,
      format: 'iife',
      sourcemap: development ? 'hidden' : false,
      // Import common packages from window.imgstckr.*
      globals: {
        react: 'imgstckr.React',
        'react-dom': 'imgstckr.ReactDOM'
      }
    },
    // Don't include common packages in bundle
    external: ['react', 'react-dom'],
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
          `${outputDirPath}/default_popup.js`,
          `${outputDirPath}/default_popup.js.map`
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
      rollupPluginVisualizer({
        gzipSize: true,
        filename: 'stats/default_popup.html'
      })
    ]
  },

  /**
   * Content Script
   *
   * Import common packages from vendor as global variables because of iife format
   */
  {
    input: 'src/content_script.tsx',
    output: {
      file: `${outputDirPath}/content_script.js`,
      format: 'iife',
      sourcemap: development ? 'hidden' : false,
      // Import common packages from window.imgstckr.*
      globals: {
        react: 'imgstckr.React',
        'react-dom': 'imgstckr.ReactDOM'
      }
    },
    // Don't include common packages in bundle
    external: ['react', 'react-dom'],
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
          `${outputDirPath}/content_script.js`,
          `${outputDirPath}/content_script.js.map`
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
