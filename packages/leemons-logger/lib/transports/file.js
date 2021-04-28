const { transports } = require('winston');
const { gzipSync } = require('zlib');
const fs = require('fs-extra');
const format = require('../format');

module.exports = () => {
  const fileName = 'logs/latest.log';

  if (fs.existsSync(fileName)) {
    try {
      const file = fs.readFileSync(fileName);
      const newName = fs.lstatSync(fileName).birthtime.toISOString();
      fs.writeFile(`logs/${newName}.log.gz`, gzipSync(file), () => {});
    } catch (e) {
      throw new Error('latest.log can not be processed');
    }
    fs.removeSync(fileName);
  }
  return new transports.File({ filename: 'logs/latest.log', format: format() });
};
