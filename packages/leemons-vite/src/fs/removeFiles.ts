import path from "path";

import { rm } from "fs-extra";

import { File } from "./listFiles";

export async function removeFiles(dir: string, files: Map<string, File>, ignored: string[] = []) {
  ignored.forEach((file) => files.delete(file));

  await Promise.all(
    [...files.values()].map((file) => rm(path.resolve(dir, file.name), {recursive : true, force: true }))
  );
}
