/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const { isEmpty } = require('lodash');
const path = require('path');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

async function finishMultipart({ fileId, path }, { transacting } = {}) {
  const dbfile = await tables.files.findOne({ id: fileId }, { transacting });
  if (!dbfile) throw new Error('No field found');

  if (dbfile.provider !== 'sys') {
    const provider = leemons.getProvider(dbfile.provider);
    if (provider?.services?.provider?.finishMultipart) {
      await provider.services.provider.finishMultipart(dbfile, path, { transacting });
    }
  }

  return true;
}

module.exports = { finishMultipart };
