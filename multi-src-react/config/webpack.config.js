const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');

const appRoot = path.resolve(__dirname, '..');
const nodeModules = path.resolve(__dirname, '../node_modules');

/** @type {import('webpack').Configuration} */
module.exports = ({ alias }) => ({
  devtool: 'eval-source-map',
  mode: 'development',
  entry: path.resolve(appRoot, 'front', 'index.js'),
  output: {
    filename: '[name].bundle.[contenthash].js',
    path: path.resolve(appRoot, 'build'),
    publicPath: '/',
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      ...alias,
      react: path.resolve(nodeModules, 'react'),
      'react-dom': path.resolve(nodeModules, 'react-dom'),
      'react-router-dom': path.resolve(nodeModules, 'react-router-dom'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(appRoot, 'src/public/index.html'),
    }),
    new WebpackBar(),
    // new BundleAnalyzerPlugin(),
  ],
});
