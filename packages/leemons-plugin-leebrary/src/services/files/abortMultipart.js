/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const { isEmpty } = require('lodash');
const path = require('path');
const fs = require('fs/promises');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

async function abortMultipart({ fileId }, { transacting } = {}) {
  const dbfile = await tables.files.findOne({ id: fileId }, { transacting });
  if (!dbfile) throw new Error('No field found');

  if (dbfile.provider !== 'sys') {
    const provider = leemons.getProvider(dbfile.provider);
    if (provider?.services?.provider?.abortMultipart) {
      await provider.services.provider.abortMultipart(dbfile, { transacting });
    }
  } else if (dbfile.isFolder) {
    await fs.rmdir(dbfile.uri, { recursive: true });
  } else {
    await fs.unlink(dbfile.uri);
  }

  await tables.files.deleteMany({ id: dbfile.id }, { transacting });

  return true;
}

module.exports = { abortMultipart };
