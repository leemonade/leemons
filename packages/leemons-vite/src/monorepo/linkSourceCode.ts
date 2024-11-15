import path from "path";

import { createFolderIfMissing } from "../fs/createFolderIfMissing";
import { createSymlink } from "../fs/createSymlink";
import { listFiles } from "../fs/listFiles";
import { PluginPaths } from "../plugins/getPluginPaths";

export async function linkSourceCode(dir: string, plugins: PluginPaths[]) {
  await createFolderIfMissing(dir);

  const existingFiles = await listFiles(dir, true);

  // Create the missing symlinks
  await Promise.all(
    plugins.map(({ name, path: pluginDir }) => {
      if (!existingFiles.get(name)) {
        return createSymlink(pluginDir, path.resolve(dir, name), 'dir');
      }
      existingFiles.delete(name);

      return null;
    })
  );

  return existingFiles;
}
