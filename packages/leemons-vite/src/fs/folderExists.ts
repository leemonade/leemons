import { lstat } from 'fs-extra';

export default async function folderExists(path: string) {
  try {
    const fileStats = await lstat(path);

    return fileStats.isDirectory();
  } catch (error) {
    return false;
  }
}
