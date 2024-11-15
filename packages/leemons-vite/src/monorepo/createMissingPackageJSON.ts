import { resolve } from 'path';

import { copyFileWithSquirrelly } from "../fs/copyFileWithSquirrelly";
import fileExists from '../fs/fileExists';

export async function createMissingPackageJSON(dir: string) {
  const packageJSONConfig = {
    name: 'leemons-vite-frontend',
    version: '0.0.1',
  };

  if (!(await fileExists(dir))) {
    await copyFileWithSquirrelly(
      resolve(__dirname, '../templates/package.json'),
      resolve(dir, 'package.json'),
      packageJSONConfig
    );
  }
}
