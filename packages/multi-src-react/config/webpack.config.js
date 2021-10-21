const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const appRoot = path.resolve(__dirname, '..');

const isDev = process.env.NODE_ENV !== 'production';
const useDebug = process.env.DEBUG;

/** @type {import('webpack').Configuration} */
module.exports = ({ alias, filesToCopy }) => ({
  devtool: isDev ? 'eval-source-map' : 'source-map',
  mode: isDev ? 'development' : 'production',
  entry: path.resolve(appRoot, 'front', 'index.js'),
  output: {
    filename: '[name].bundle.[contenthash].js',
    path: path.resolve(appRoot, 'build'),
    publicPath: '/',
  },
  infrastructureLogging: {
    level: 'none',
  },
  stats: false,
  devServer: {
    compress: true,
    hot: false,
    port: 3000,
    client: {
      overlay: {
        errors: false,
        warnings: false,
      },
    },
    historyApiFallback: true,
  },
  resolve: {
    symlinks: false,
    alias: {
      ...alias,
      react: path.resolve(require.resolve('react'), '..'),
      'react-dom': path.resolve(require.resolve('react-dom'), '..'),
      'react-router-dom': path.resolve(require.resolve('react-router-dom'), '..'),
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
                plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
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
    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new ReactRefreshWebpackPlugin(),
    useDebug && new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        ...filesToCopy,
        { from: path.resolve(__dirname, '..', 'src', 'public'), to: 'public' },
      ],
    }),
  ].filter(Boolean),
});
