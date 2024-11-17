import { copy, remove } from 'fs-extra';

import folderExists from './folderExists';

export async function copyFolder(src: string, dest: string) {
  try {
    if ((await folderExists(dest))) {
      await remove(dest);
  }

    await copy(src, dest);
  } catch (e) {
    throw new Error(`Can't copy folder ${src} into ${dest}`);
  }
}
