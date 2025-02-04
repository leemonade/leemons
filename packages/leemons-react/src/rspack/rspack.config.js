const { rspack } = require('@rspack/core');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = function rspackConfig({
  app,
  build,
  alias,
  publicFiles,
  isDev = process.env.NODE_ENV !== 'production',
  lazy,
  useDebug = process.env.DEBUG,
}) {
  /** @type {import('@rspack/core').Configuration} */
  const config = {
    mode: isDev ? 'development' : 'production',
    entry: [path.join(app, 'index.js'), path.resolve(app, 'hotManagement.js')],
    output: {
      path: build,
      filename: 'static/js/[name].[contenthash].js',
      chunkFilename: 'static/js/[name].[contenthash].chunk.js',
      assetModuleFilename: 'static/media/[name].[contenthash][ext]',
      cssFilename: 'static/css/[name].[contenthash].css',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          type: 'javascript/auto',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                },
              },
              target: 'es2015',
            },
          },
        },
        {
          test: /\.c?m?jsx?$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          type: 'javascript/auto',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                },
              },
              target: 'es2015',
            },
          },
        },
        {
          oneOf: [
            {
              test: /\.svg$/,
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx|cjs|mjs|cjsx|mjsx|css)$/],
              },
              use: [
                {
                  loader: '@svgr/webpack',
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
              ],
              type: 'asset/resource',
            },
          ],
        },
        {
          exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|cjs|mjs|html|json|css)$/],
          parser: {
            dataUrlCondition: {
              maxSize: 10000,
            },
          },
          type: 'asset',
        },

        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "asset" loader.
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      symlinks: false,
      mainFields: ['browser', 'module', 'main'],
      alias: {
        ...alias,
        chalk: path.resolve(require.resolve('chalk'), '..'),
        react: path.resolve(require.resolve('react'), '..'),
        'react-dom': path.resolve(require.resolve('react-dom'), '..'),
        'react-router-dom': path.resolve(require.resolve('react-router-dom'), '..'),
        '@tanstack/react-query': path.resolve(require.resolve('@tanstack/react-query'), '..'),
        '@loadable/component': path.resolve(require.resolve('@loadable/component')),
        'leemons-hooks': path.resolve(require.resolve('leemons-hooks')),
      },
      fallback: {
        fs: false,
        path: false,
        process: false,
        url: false,
      },
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: path.resolve(__dirname, '../templates', isDev ? 'dev.html' : 'prod.html'),
        filename: 'index.html',
      }),
      isDev &&
        new ReactRefreshPlugin({
          overlay: {
            module: path.resolve(__dirname, './customErrorOverlay.js'),
          },
        }),
      publicFiles?.length &&
        new rspack.CopyRspackPlugin({
          patterns: publicFiles,
        }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve('../..', 'tsconfig.frontend.json'),
        },
      }),
    ].filter(Boolean),
    devServer: {
      port: process.env.PORT || process.env.port,
      client: {
        overlay: false,
        progress: true,
        reconnect: true,
      },
      hot: true,
      liveReload: true,
      historyApiFallback: {
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      },
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    experiments: {
      lazyCompilation: isDev && lazy,
      css: true,
    },

    stats: false,
    infrastructureLogging: {
      level: 'none',
    },
  };

  console.log('rspack ready!');

  return config;
};
