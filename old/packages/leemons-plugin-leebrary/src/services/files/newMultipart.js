/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const { isEmpty } = require('lodash');
const path = require('path');
const fsPromises = require('fs/promises');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

async function newMultipart(
  { name, type, size, isFolder, filePaths, pathsInfo },
  { transacting } = {}
) {
  const extension = mime.extension(type);

  const [file, settings] = await Promise.all([
    tables.files.create(
      {
        name,
        type,
        extension,
        size,
        isFolder,
        provider: 'sys',
        uri: '',
        metadata: JSON.stringify({ pathsInfo }),
      },
      { transacting }
    ),
    getSettings({ transacting }),
  ]);

  if (settings?.providerName) {
    const provider = leemons.getProvider(settings.providerName);
    file.provider = settings.providerName;
    if (provider?.services?.provider?.newMultipart) {
      file.uri = await provider.services.provider.newMultipart(file, { filePaths, transacting });
    }
  }

  if (isEmpty(file.uri)) {
    file.provider = 'sys';
    if (!file.isFolder) {
      file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}.${file.extension}`);
      await fsPromises.writeFile(file.uri, '');
    } else {
      file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}`);
      for (let i = 0; i < filePaths.length; i++) {
        await fsPromises.mkdir(path.dirname(`${file.uri}/${filePaths[i]}`), { recursive: true });
        await fsPromises.writeFile(`${file.uri}/${filePaths[i]}`, '');
      }
    }
  }

  return tables.files.update({ id: file.id }, file, { transacting });
}

module.exports = { newMultipart };
