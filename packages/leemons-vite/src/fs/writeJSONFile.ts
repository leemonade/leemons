import { writeJSON } from 'fs-extra';

export async function writeJSONFile(path: string, data: object) {
  await writeJSON(path, data, { spaces: 2 });
}
