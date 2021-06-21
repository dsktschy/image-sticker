import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { visualizer } from 'rollup-plugin-visualizer'
import createStyledComponentsTransformer from 'typescript-plugin-styled-components'

const styledComponentsTransformer = createStyledComponentsTransformer({
  minify: true
})

const development = process.env.NODE_ENV === 'development'

// In test, expected behavior of content script can't be gotten
// without content_script settings in manifest.json
// because of following reasons
// - executeScript of extension fails on puppeteer
// - chrome(browser).runtime is undefined
//   in content script injected by addScriptTag of puppeteer
// So create artifact for test in dist/test
const outputDirPath = process.env.IMGSTCKR_TEST
  ? 'dist/test'
  : 'dist/production'

const baseOutput = {
  dir: outputDirPath,
  format: 'iife',
  sourcemap: development ? 'hidden' : false
}

const basePlugins = [
  alias({
    entries: {
      '~': 'src'
    }
  }),
  commonjs(),
  nodeResolve({
    browser: true
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  typescript({
    inlineSourceMap: development,
    transformers: [
      () => ({
        before: [styledComponentsTransformer]
      })
    ]
  }),
  terser({
    format: {
      comments: false
    }
  }),
  postcss({
    minimize: true
  })
]

// Single options object including input prop that is array
// is not available, because it causes error by code splitting
// Code splitting doesn't support iife format
export default [
  /**
   * vendor.js
   *
   * Provide common packages as global variables
   * from vendor.js to other entry points
   * for parallel requests and long term caching
   * because code splitting doesn't support iife format
   * https://github.com/rollup/rollup/issues/2072
   */
  {
    input: 'src/vendor.ts',
    output: {
      ...baseOutput,
      // Export common packages to window.imgstckr
      name: 'imgstckr'
    },
    plugins: [
      ...basePlugins,
      del({
        targets: [
          `${outputDirPath}/vendor.js`,
          `${outputDirPath}/vendor.js.map`
        ]
      }),
      visualizer({
        gzipSize: true,
        filename: 'stats/vendor.html'
      })
    ]
  },

  /**
   * background.js
   *
   * Settings for public files are also written here
   */
  {
    input: 'src/background.ts',
    output: {
      ...baseOutput
    },
    plugins: [
      ...basePlugins,
      del({
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
      visualizer({
        gzipSize: true,
        filename: 'stats/background.html'
      }),
      // Settings for public files
      copy({
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
   * default_popup.js
   *
   * Import common packages from vendor as global variables because of iife format
   */
  {
    input: 'src/default_popup.tsx',
    output: {
      ...baseOutput,
      // Import common packages from window.imgstckr
      globals: {
        react: 'imgstckr.React',
        'react-dom': 'imgstckr.ReactDOM'
      }
    },
    // Don't include common packages in bundle
    external: ['react', 'react-dom'],
    plugins: [
      ...basePlugins,
      del({
        targets: [
          `${outputDirPath}/default_popup.js`,
          `${outputDirPath}/default_popup.js.map`
        ]
      }),
      visualizer({
        gzipSize: true,
        filename: 'stats/default_popup.html'
      })
    ]
  },

  /**
   * content_script.js
   *
   * Import common packages from vendor as global variables because of iife format
   */
  {
    input: 'src/content_script.tsx',
    output: {
      ...baseOutput,
      // Import common packages from window.imgstckr
      globals: {
        react: 'imgstckr.React',
        'react-dom': 'imgstckr.ReactDOM'
      }
    },
    // Don't include common packages in bundle
    external: ['react', 'react-dom'],
    plugins: [
      ...basePlugins,
      del({
        targets: [
          `${outputDirPath}/content_script.js`,
          `${outputDirPath}/content_script.js.map`
        ]
      }),
      visualizer({
        gzipSize: true,
        filename: 'stats/content_script.html'
      })
    ]
  }
]
