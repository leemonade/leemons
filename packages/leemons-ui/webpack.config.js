const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const tailwind = require('tailwindcss');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
      path.join(__dirname, '../../node_modules'),
    ],
    alias: {
      // react: path.join(__dirname, 'node_modules', 'react'),
      react: path.join(__dirname, '../../node_modules', 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [tailwind, {}],
                  ['autoprefixer', {}],
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
  ],
};
