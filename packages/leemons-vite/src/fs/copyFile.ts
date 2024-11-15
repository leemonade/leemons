import { copyFile as copyFileFn } from 'fs-extra';

export async function copyFile(src: string, dest: string) {
  try {
    await copyFileFn(src, dest);
  } catch (e) {
    console.log(e);
    throw new Error(`Can't copy file ${src} into ${dest}`);
  }
}
