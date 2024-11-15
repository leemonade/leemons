import { mkdirp } from 'fs-extra';

import folderExists from './folderExists';

export async function createFolderIfMissing(dir: string) {
  try {
    if (!(await folderExists(dir))) {
      await mkdirp(dir);
    }
  } catch (e) {
    throw new Error(`Can't create folder ${dir}`);
  }
}
