const squirrelly = require('squirrelly');
const path = require('path');
const fs = require('fs-extra');

/* Squirrelly Helpers */
squirrelly.filters.define('capitalize', (str) => str.charAt(0).toUpperCase() + str.substring(1));

squirrelly.filters.define('clear', (str) =>
  str
    .split(/[-_]/)
    .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
    .join('')
);

module.exports = async function copyFileWithSquirrelly(src, dest, config) {
  const App = await squirrelly.renderFile(path.resolve(src), config);

  await fs.writeFile(dest, App);
};
