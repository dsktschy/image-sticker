/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default
const styledComponentsTransformer = createStyledComponentsTransformer({
  minify: true
})

module.exports = (env, { mode }) => ({
  // eval is not allowed in extension code,
  // and .map file can not be loaded, so use inline
  devtool: mode === 'production' ? false : 'inline-source-map',

  entry: {
    content_script: path.resolve(__dirname, 'src/content_script.tsx'),
    default_popup: path.resolve(__dirname, 'src/default_popup.tsx'),
    background: path.resolve(__dirname, 'src/background.ts')
  },

  output: {
    path: env.IMGSTCKR_TEST
      ? path.resolve(__dirname, 'dist/test')
      : path.resolve(__dirname, 'dist/production'),
    filename: '[name].js'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers() {
                return { before: [styledComponentsTransformer] }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('cssnano')({
                    preset: 'default'
                  })
                ]
              }
            }
          }
        ]
      }
    ]
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    },
    // Enable to import without extentions
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'default_popup'],
      filename: 'default_popup.html',
      title: 'Image Sticker'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          globOptions: {
            ignore: ['**/public/manifests']
          }
        },
        // Switch how to inject content_script.js
        env.IMGSTCKR_TEST
          ? {
              from: path.resolve(__dirname, 'public/manifests/test.json'),
              to: path.resolve(__dirname, 'dist/test/manifest.json')
            }
          : {
              from: path.resolve(__dirname, 'public/manifests/production.json'),
              to: path.resolve(__dirname, 'dist/production/manifest.json')
            }
      ]
    })
  ]
})
