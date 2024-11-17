import fileExists from './fileExists';

export default async function fileExistsMultiextension(path: string, extensions: string[]) {
  try {
    for (const extension of extensions) {
      if (await fileExists(`${path}.${extension}`)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}
