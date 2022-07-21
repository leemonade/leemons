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
      extends: ['plugin:react/recommended', 'airbnb-base', 'prettier'],
      parser: 'babel-eslint',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 12,
        sourceType: 'module',
      },
      plugins: ['react', 'import', 'prettier'],
      rules: {
        'no-plusplus': 'off',
        'import/no-dynamic-requires': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-underscore-dangle': 'off',
        'prettier/prettier': [2, {}, { usePrettierrc: true }],
        'import/no-names-as-default': 'off',
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
