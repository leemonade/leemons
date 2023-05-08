const fsPromises = require('fs/promises');
const { tables } = require('../tables');

async function uploadMultipartChunk({ fileId, partNumber, chunk }, { transacting } = {}) {
  const dbfile = await tables.files.findOne({ id: fileId }, { transacting });
  if (!dbfile) throw new Error('No field found');

  const buffer = await fsPromises.readFile(chunk.path);
  if (dbfile.provider !== 'sys') {
    const provider = leemons.getProvider(dbfile.provider);
    if (provider?.services?.provider?.uploadMultipartChunk) {
      await provider.services.provider.uploadMultipartChunk(dbfile, partNumber, buffer, {
        transacting,
      });
    }
  } else {
    await fsPromises.appendFile(dbfile.uri, buffer);
  }
  return true;
}

module.exports = { uploadMultipartChunk };
