const fs = require('fs-extra');
const path = require('path');

async function getEslint(basePath) {
  try {
    const jsonPath = path.resolve(basePath, '.eslintrc.json');
    const eslintRc = await fs.readJSON(jsonPath);

    if (eslintRc) {
      return eslintRc;
    }

    throw new Error('.eslintrc.json not found');
  } catch (e) {
    return {
      env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
      },
      globals: { leemons: true },
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:sonarjs/recommended',
        'airbnb-base',
        'prettier',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-syntax-jsx'],
        },
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['react', 'react-hooks', 'sonarjs', 'import', 'prettier'],
      rules: {
        radix: 'off',
        'no-plusplus': 'off',
        'no-unused-vars': 'warn',
        'import/no-dynamic-requires': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-underscore-dangle': 'off',
        'prettier/prettier': [2, {}, { usePrettierrc: true }],
        'import/no-names-as-default': 'off',
        'import/prefer-default-export': 'warn',
      },
    };
  }
}

module.exports = async function createEsLint({
  plugins,
  basePath = path.resolve(__dirname, '../../../../'),
}) {
  const config = await getEslint(basePath);

  if (!config.rules) {
    config.rules = {};
  }

  config.rules['import/no-unresolved'] = [
    2,
    {
      ignore: plugins
        .map((plugin) => `@${plugin.name}`)
        .sort()
        .concat(['@bubbles-ui']),
    },
  ];

  fs.writeJson(path.resolve(basePath, '.eslintrc.json'), config, {
    encoding: 'utf8',
    spaces: 2,
  });
};
