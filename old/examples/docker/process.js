const fs = require('fs');
const file = __dirname + '/config/config.js';
const path = require('path');

function fromDir(startPath, filter, acc = []) {
  if (!fs.existsSync(startPath)) {
    return acc;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (filename.indexOf('node_modules') < 0 && stat.isDirectory()) {
      fromDir(filename, filter, acc); //recurse
    } else if (filename.endsWith(filter)) {
      acc.push(filename);
    }
  }
  return acc;
}

/*
fs.writeFileSync(
  file,
  fs
    .readFileSync(file)
    .toString()
    .replace('{{socketPlugin}}', process.env.SOCKET_PLUGIN || null)
    .replace('{{apiUrl}}', process.env.API_URL || null)
);
*/

const files = fromDir('../../', 'package.json');

files.forEach((file) => {
  fs.writeFileSync(
    file,
    fs
      .readFileSync(file)
      .toString()
      .replace(/("@bubbles-ui\/.+":) "(.+)"/g, `$1 "${process.env.BUBBLES_VERSION}"`)
  );
});
