import { readdir } from "fs-extra";

import { FileType, getFileType } from "./getFileType";

export interface File {
  name: string;
  type: FileType;
}

export async function listFiles(dir: string, useMap: true): Promise<Map<string, File>>;
export async function listFiles(dir: string, useMap: false): Promise<File[]>;
export async function listFiles<T extends boolean>(
  dir: string,
  useMap: T
) {
  const data = await readdir(dir, { withFileTypes: true });
  const files = data.map((file) => ({
    name: file.name,
    type: getFileType(file),
  }));

  if (useMap) {
    const map = new Map<string, File>();
    files.map((file) => map.set(file.name, file));
    return map;
  }

  return files;
}
