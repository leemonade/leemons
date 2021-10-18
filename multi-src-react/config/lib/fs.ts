import fs from 'fs-extra';
import path from 'path';
import squirrelly from 'squirrelly';

async function _fileExists(
  dir: string,
  validateFiles: boolean = false
): Promise<boolean> {
  try {
    if (!validateFiles) {
      return (await fs.lstat(dir)).isDirectory();
    }

    const stats = await fs.lstat(dir);
    return Boolean(stats) && !stats.isDirectory();
  } catch (e) {
    return false;
  }
}

// Check if exists and is not a folder
export function fileExists(dir: string): Promise<boolean> {
  return _fileExists(dir, true);
}

// Check if exists and is a folder
export function folderExists(dir: string): Promise<boolean> {
  return _fileExists(dir, false);
}

// Create folder and parents if needed
export async function createFolder(dir: string): Promise<void> {
  try {
    await fs.mkdirp(dir);
  } catch (e) {
    throw new Error("Can't create  folder");
  }
}

// Create folder only if does not exists
export async function createFolderIfMissing(dir: string): Promise<void> {
  try {
    if (!(await folderExists(dir))) {
      await createFolder(dir);
    }
  } catch (e) {
    throw new Error("Can't create folder");
  }
}

// Create a file with content
export async function createFile(
  dir: string,
  content: string | Buffer
): Promise<any> {
  try {
    return await fs.writeFile(dir, content);
  } catch (e) {
    throw new Error("Can't save file");
  }
}

// Create a symbolic link
export async function createSymLink(
  src: string,
  dest: string,
  type: fs.SymlinkType = 'dir'
) {
  try {
    if (await folderExists(src)) {
      return await fs.createSymlink(src, dest, type);
    }
    return null;
  } catch (e) {
    throw new Error("Can't create symlink");
  }
}

enum fileType {
  SymbolicLink = 'symbolicLink',
  Directory = 'directory',
  File = 'file',
  Null = 'null',
}
// Get which file type is a file
export function getFileType(file: fs.Dirent): fileType {
  if (file.isSymbolicLink()) {
    return fileType.SymbolicLink;
  }
  if (file.isDirectory()) {
    return fileType.Directory;
  }
  if (file.isFile()) {
    return fileType.File;
  }

  return fileType.Null;
}

export interface fileList {
  name: string;
  type: fileType;
}
// List all the files inside a directory

export function listFiles(
  dir: string,
  useMap: true
): Promise<Map<string, fileList>>;
export function listFiles(dir: string, useMap: false): Promise<fileList[]>;
export async function listFiles(
  dir: string,
  useMap: boolean = false
): Promise<Map<string, fileList> | fileList[]> {
  try {
    const data = (await fs.readdir(dir, { withFileTypes: true })).map(
      (file) => ({
        name: file.name,
        type: getFileType(file),
      })
    );
    if (useMap) {
      const map = new Map();
      data.map((file) => map.set(file.name, file));
      return map;
    }
    return data;
  } catch (e) {
    throw new Error("Can't read directory");
  }
}

export async function removeFiles(
  dir: string,
  files: Map<string, fileList>,
  ignored: string[] = []
): Promise<void> {
  ignored.forEach((file) => files.delete(file));

  await Promise.all(
    [...files.values()].map((file) =>
      fs.rm(
        path.isAbsolute(file.name) ? file.name : path.resolve(dir, file.name),
        {
          recursive: true,
          force: true,
        }
      )
    )
  );
}

// Generate app.js file
export async function copyFileWithSquirrelly(
  src: string,
  dest: string,
  config
): Promise<void> {
  const App = await squirrelly.renderFile(
    path.resolve(src, 'App.squirrelly'),
    config
  );

  await fs.writeFile(dest, App);
}

export async function copyFile(src: string, dest: string): Promise<void> {
  try {
    await fs.copyFile(src, dest);
  } catch (e) {
    throw new Error(`Can't copy file ${src} into ${dest}`);
  }
}
