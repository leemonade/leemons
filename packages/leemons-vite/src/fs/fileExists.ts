import { lstat } from 'fs-extra';

export default async function fileExists(path: string) {
  try {
    const fileStats = await lstat(path);

    return fileStats.isFile();
  } catch (error) {
    return false;
  }
}
