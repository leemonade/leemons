const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const appRoot = path.resolve(__dirname, '..');

const isDev = process.env.NODE_ENV !== 'production';
const isProduction = !isDev;
const useDebug = process.env.DEBUG;

/** @type {import('webpack').Configuration} */
module.exports = ({ alias, filesToCopy, useLegacy = false }) => ({
  mode: isDev ? 'development' : 'production',
  // Stop compilation on first error if production mode
  bail: isProduction,
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  entry: path.resolve(appRoot, 'front', 'index.js'),
  output: {
    path: path.resolve(appRoot, 'build'),
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isDev,
    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    assetModuleFilename: isProduction
      ? 'static/media/[name].[hash][ext]'
      : 'static/media/[name].[ext]',
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    publicPath: '/',
  },
  // Do not output compilation info
  infrastructureLogging: {
    level: useLegacy ? 'info' : 'none',
  },
  // Do not output compilation assets info (handled by custom hooks)
  stats: useLegacy ? {} : false,
  optimization: {
    minimize: isProduction,
    minimizer: [
      // This is only used in production
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
    ],
  },
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
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  resolve: {
    symlinks: false,
    alias: {
      ...alias,
      react: path.resolve(require.resolve('react'), '..'),
      'react-dom': path.resolve(require.resolve('react-dom'), '..'),
      'react-router-dom': path.resolve(require.resolve('react-router-dom'), '..'),
      'react-query': path.resolve(require.resolve('react-query'), '..'),
    },
  },
  module: {
    // Enforce the named imports to be exported
    // strictExportPresence: isProduction,
    rules: [
      {
        enforce: 'pre',
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        loader: require.resolve('source-map-loader'),
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // TODO: Allow users to define it
                maxSize: 10000,
              },
            },
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: require.resolve('@svgr/webpack'),
                options: {
                  prettier: false,
                  svgo: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              },
              {
                loader: require.resolve('file-loader'),
                options: {
                  name: 'static/media/[name].[hash].[ext]',
                },
              },
            ],
            issuer: {
              and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
            },
          },
          {
            test: /\.js|mjs|jsx$/,
            // exclude: /node_modules/,
            exclude: /node_modules\/(?!(@bubbles-ui\/*)\/).*/,
            loader: 'babel-loader',
            options: {
              plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
              presets: ['@babel/preset-react'],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: false,
              compact: isProduction,
            },
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                },
              },
              'postcss-loader',
            ],
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            type: 'asset/resource',
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
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
    isProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    new CopyPlugin({
      patterns: [
        ...filesToCopy,
        { from: path.resolve(__dirname, '..', 'src', 'public'), to: 'public' },
      ],
    }),
  ].filter(Boolean),
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  performance: false,
  ignoreWarnings: [/Failed to parse source map/],
});
