import { createSymlink as createSymlinkFn } from "fs-extra";

import folderExists from "./folderExists";

export async function createSymlink(src: string, dest: string, type: 'dir' | 'file') {
  try {
    if (await folderExists(src)) {
      return await createSymlinkFn(src, dest, type);
    }

    return null;
  } catch (e) {
    throw new Error(`Can't create symlink ${src} -> ${dest}`);
  }
}
