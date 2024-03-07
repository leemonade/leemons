import { join, dirname, resolve } from 'path';
import { readFileSync } from 'fs';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

function getAliasesFromJsconfig() {
  const jsconfig = JSON.parse(readFileSync(resolve(__dirname, '../../../../jsconfig.json'), 'utf-8'));
  const paths = jsconfig.compilerOptions.paths;
  const aliases = {};

  for (const key in paths) {
    if (Object.hasOwn(paths, key)) {
      const path = paths[key][0]; // Tomamos el primer path en caso de que haya varios
      aliases[key.replace('/*', '')] = resolve(__dirname, `../../../../${path.replace('/*', '')}`);
    }
  }

  return aliases;
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    './Welcome/Welcome.stories.js',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    // getAbsolutePath('@storybook-addon-designs'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    const aliasesFromJsconfig = getAliasesFromJsconfig();

    config.resolve = {
      ...config.resolve,
      symlinks: false,
      alias: {
        ...config.resolve.alias,
        ...aliasesFromJsconfig,
        react: resolve(require.resolve('react'), '..'),
        'react-dom': resolve(require.resolve('react-dom'), '..'),
        'react-router-dom': resolve(require.resolve('react-router-dom'), '..'),
      },
    };
    return config;
  },
};

export default config;
