/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const { isEmpty } = require('lodash');
const path = require('path');
const fsPromises = require('fs/promises');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

async function newMultipart({ name, type, size }, { transacting } = {}) {
  const extension = mime.extension(type);

  const [file, settings] = await Promise.all([
    tables.files.create({ name, type, extension, size, provider: 'sys', uri: '' }, { transacting }),
    getSettings({ transacting }),
  ]);

  if (settings?.providerName) {
    const provider = leemons.getProvider(settings.providerName);
    file.provider = settings.providerName;
    if (provider?.services?.provider?.newMultipart) {
      file.uri = await provider.services.provider.newMultipart(file, { transacting });
    }
  }

  if (isEmpty(file.uri)) {
    file.provider = 'sys';
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}.${file.extension}`);
    await fsPromises.writeFile(file.uri, '');
  }

  return tables.files.update({ id: file.id }, file, { transacting });
}

module.exports = { newMultipart };
