/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
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
      chunks: ['default_popup'],
      filename: 'default_popup.html',
      title: 'Image Sticker'
    }),
    new CopyWebpackPlugin({
      patterns: [path.resolve(__dirname, 'public')]
    })
  ]
})
