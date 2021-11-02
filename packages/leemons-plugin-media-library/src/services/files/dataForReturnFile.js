const _ = require('lodash');

const fs = require('fs');
const { table } = require('../tables');

async function dataForReturnFile(id, { transacting } = {}) {
  const file = await table.files.findOne({ id }, { transacting });
  if (file.provider === 'sys') {
    return {
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: fs.createReadStream(file.url),
    };
  }
  throw new Error(`The provider "${file.provider}" not found`);
}

module.exports = { dataForReturnFile };
