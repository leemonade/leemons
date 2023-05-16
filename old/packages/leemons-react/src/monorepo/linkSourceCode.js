const path = require('path');
const { createFolderIfMissing, createSymlink, listFiles } = require('../fs');

module.exports = async function linkSourceCode(dir, plugins) {
  await createFolderIfMissing(dir);

  // Check which files still exists
  const existingFiles = await listFiles(dir, true);

  // Create the missing symlinks
  await Promise.all(
    plugins.map(({ name, path: pluginDir }) => {
      if (!existingFiles.get(name)) {
        return createSymlink(pluginDir, path.resolve(dir, name));
      }
      existingFiles.delete(name);

      return null;
    })
  );

  // Return extra files
  return existingFiles;
};
