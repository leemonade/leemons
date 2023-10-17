// @ts-check
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function webpackConfig({
  app,
  build,
  alias,
  publicFiles,
  isDev = process.env.NODE_ENV !== 'production',
  useDebug = process.env.DEBUG,
}) {
  const isProduction = !isDev;

  /** @type {import("webpack").Configuration} */
  const config = {
    mode: isDev ? 'development' : 'production',
    entry: [path.join(app, 'index.js'), path.resolve(app, 'hotManagement.js')],
    output: {
      path: build,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isDev,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: 'static/js/[name].[contenthash].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'static/js/[name].[contenthash].chunk.js',
      assetModuleFilename: 'static/media/[name].[contenthash][ext]',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      publicPath: '/',
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        // This is only used in production
        new TerserPlugin({
          terserOptions: {
            compress: {
              ecma: 5,
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
      // Automatically split vendor and commons
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        usedExports: true,
      },
    },
    devServer: {
      compress: true,
      hot: isDev,
      port: process.env.PORT || process.env.port,
      client: {
        overlay: {
          errors: false,
          warnings: false,
        },
      },
      historyApiFallback: {
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      },
    },
    resolve: {
      /*
      fallback: {
        fs: false,
        tsl: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
      },
      */
      symlinks: false,
      alias: {
        ...alias,
        chalk: path.resolve(require.resolve('chalk'), '..'),
        react: path.resolve(require.resolve('react'), '..'),
        'react-dom': path.resolve(require.resolve('react-dom'), '..'),
        'react-router-dom': path.resolve(require.resolve('react-router-dom'), '..'),
        '@tanstack/react-query': path.resolve(require.resolve('@tanstack/react-query'), '..'),
        '@loadable/component': path.resolve(require.resolve('@loadable/component')),
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
                    name: 'static/media/[name].[contenthash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            {
              test: /\.(js|mjs|jsx)$/,
              // exclude: /node_modules/,
              exclude: /node_modules\/(?!(@bubbles-ui\/*)\/).*/,
              loader: 'babel-loader',
              options: {
                // plugins: [isDev && require.resolve('react-hot-loader/babel')],
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
      new NodePolyfillPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../templates', isDev ? 'dev.html' : 'prod.html'),
      }),
      isDev && new ReactRefreshWebpackPlugin(),
      useDebug && new BundleAnalyzerPlugin({ analyzerMode: 'disabled' }),
      useDebug && new webpack.debug.ProfilingPlugin(),
      isProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      // new LoadablePlugin({ filename: 'stats.json', writeToDisk: true }),
      publicFiles?.length &&
      new CopyPlugin({
        patterns: [...publicFiles],
      }),
    ].filter(Boolean),
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
    ignoreWarnings: [/Failed to parse source map/],
    experiments: {
      cacheUnaffected: true,
      lazyCompilation: isDev,
    },
    stats: false,
    infrastructureLogging: {
      level: 'none',
    },
  };

  console.log('webpack ready!');

  return config;
};
