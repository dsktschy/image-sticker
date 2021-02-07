/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  // eval is not allowed in extension code,
  // and .map file can not be loaded, so use inline
  devtool: 'inline-cheap-source-map',

  entry: {
    content_script: path.resolve(__dirname, 'src/content_script.tsx'),
    default_popup: path.resolve(__dirname, 'src/default_popup.ts')
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  resolve: {
    // Enable to import without extentions
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/default_popup.html'),
      filename: 'default_popup.html',
      inject: false
    }),
    new CopyWebpackPlugin({
      patterns: [path.resolve(__dirname, 'public')]
    })
  ]
}
