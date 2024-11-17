import path from 'path';

import { copyFile } from '../fs/copyFile';
import { copyFileWithSquirrelly } from '../fs/copyFileWithSquirrelly';
import { createFolderIfMissing } from '../fs/createFolderIfMissing';
import { removeFiles } from '../fs/removeFiles';
import { PluginAliases } from '../plugins/getAliases';
import { PluginPaths } from '../plugins/getPluginPaths';

import { createMissingPackageJSON } from './createMissingPackageJSON';
import { generateAliasesFile } from './generateAliasesFile';
import { generateTSAndJSConfig } from './generateTSAndJSConfig';
import { linkSourceCode } from './linkSourceCode';

interface BuildMonorepoOptions {
  outputDir: string;
  basePath: string;
  plugins: PluginPaths[];
  aliases: PluginAliases;
}

export async function buildMonorepo({ outputDir, basePath, plugins }: BuildMonorepoOptions) {
  await createFolderIfMissing(outputDir);
  await createMissingPackageJSON(outputDir);

  // index.html
  await copyFile(
    path.resolve(__dirname, '../templates/index.html'),
    path.resolve(outputDir, 'index.html')
  );

  // index.js
  await copyFile(
    path.resolve(__dirname, '../templates/index.tsx'),
    path.resolve(outputDir, 'index.tsx')
  );

  // reset.css
  await copyFile(
    path.resolve(__dirname, '../templates/reset.css'),
    path.resolve(outputDir, 'reset.css')
  );

  // Contexts
  await createFolderIfMissing(path.resolve(outputDir, 'contexts'));

  await copyFile(
    path.resolve(__dirname, '../templates/contexts/global.jsx'),
    path.resolve(outputDir, 'contexts', 'global.jsx')
  );

  await copyFileWithSquirrelly(
    path.resolve(__dirname, '../templates/contexts/apiURL.squirrelly'),
    path.resolve(outputDir, 'contexts', 'apiURL.ts'),
    { apiUrl: process.env.API_URL, allOriginsUrl: process.env.ALL_ORIGINS_URL }
  );

  // App.tsx
  await copyFileWithSquirrelly(
    path.resolve(__dirname, '../templates/App.squirrelly'),
    path.resolve(outputDir, 'App.tsx'),
    { plugins }
  );

  const filesToRemove = await linkSourceCode(path.resolve(outputDir, 'plugins'), plugins);
  await removeFiles(path.resolve(outputDir, 'plugins'), filesToRemove);

  await generateTSAndJSConfig(basePath, plugins);

  await generateAliasesFile(outputDir, plugins);
  await copyFile(
    path.resolve(__dirname, '../templates/vite.config.mjs'),
    path.resolve(outputDir, 'vite.config.mjs')
  );
}
