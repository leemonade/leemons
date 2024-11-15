import type { Dirent } from "fs-extra";

export type FileType = 'symbolicLink' | 'directory' | 'file' | 'null';

const FILE_TYPES: Record<string, FileType> = {
  SymbolicLink: 'symbolicLink',
  Directory: 'directory',
  File: 'file',
  Null: 'null',
};

export function getFileType(file: Dirent): FileType {
  if (file.isSymbolicLink()) {
    return FILE_TYPES.SymbolicLink;
  }
  if (file.isDirectory()) {
    return FILE_TYPES.Directory;
  }
  if (file.isFile()) {
    return FILE_TYPES.File;
  }

  return FILE_TYPES.Null;
}
