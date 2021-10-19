const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    symlinks: false,
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
        oneOf: [
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
          {
            test: /\.svg$/,
            type: 'asset/resource',
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(appRoot, 'src/public/index.html'),
    }),
    new WebpackBar(),
    // new BundleAnalyzerPlugin(),
  ],
});
