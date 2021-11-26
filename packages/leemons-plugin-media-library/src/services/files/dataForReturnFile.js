const fs = require('fs');
const { table } = require('../tables');
const { getActiveProvider } = require('../config/getActiveProvider');

async function dataForReturnFile(id, { transacting } = {}) {
  const file = await table.files.findOne({ id }, { transacting });

  if (file.provider === 'sys') {
    return {
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: fs.createReadStream(file.url),
    };
  }
  const provider = leemons.getProvider(file.provider);
  if (
    provider &&
    provider.services &&
    provider.services.provider &&
    provider.services.provider.getReadStream
  ) {
    return {
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: await provider.services.provider.getReadStream(file.url, { transacting }),
    };
  }

  throw new Error(`The provider "${file.provider}" not found`);
}

module.exports = { dataForReturnFile };
