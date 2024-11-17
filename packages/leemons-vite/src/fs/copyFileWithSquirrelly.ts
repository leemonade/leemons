import { writeFile } from 'fs-extra';
import * as squirrelly from 'squirrelly';

/* Squirrelly Helpers */
squirrelly.filters.define('capitalize', (str) => str.charAt(0).toUpperCase() + str.substring(1));

squirrelly.filters.define('clear', (str) =>
  str
    .split(/[-_]/)
    .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
    .join('')
);

export async function copyFileWithSquirrelly(
  src: string,
  dest: string,
  config: Record<string, unknown>
) {
  const file = await squirrelly.renderFile(src, config);

  await writeFile(dest, file);
}
