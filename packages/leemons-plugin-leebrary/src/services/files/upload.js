/* eslint-disable no-param-reassign */
const { toLower } = require('lodash');
const mime = require('mime-types');
const pathSys = require('path');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

const ADMITTED_METADATA = [
  'format',
  'duration',
  // 'framerate',
  'words',
  'totaltime',
  'revision',
  'pages',
  'slides',
  'spreadsheets',
  'books',
  // 'height',
  // 'width',
  'bitrate',
  // 'channels',
];

function getReadableDuration(milliseconds, padStart) {
  function pad(num) {
    return `${num}`.padStart(2, '0');
  }
  const asSeconds = milliseconds / 1000;

  let hours;
  let minutes = Math.floor(asSeconds / 60);
  const seconds = Math.floor(asSeconds % 60);

  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes %= 60;
  }

  return hours
    ? `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}`
    : `${padStart ? pad(minutes) : minutes}:${pad(seconds)}`;
}

function getReadableBitrate(bitrate) {
  let i = -1;
  const byteUnits = [' kbps', ' Mbps', ' Gbps', ' Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps'];
  do {
    bitrate /= 1000;
    i++;
  } while (bitrate > 1000);

  return Math.max(bitrate, 0.1).toFixed(1) + byteUnits[i];
}

function getReadableFileSize(b) {
  let u = 0;
  const s = 1024;
  while (b >= s || -b >= s) {
    // eslint-disable-next-line no-param-reassign
    b /= s;
    u++;
  }
  return `${(u ? `${b.toFixed(1)} ` : b) + ' KMGTPEZY'[u]}B`;
}

function getMetaProps(data, result = {}) {
  Object.keys(data).forEach((key) => {
    const current = toLower(key);
    // Prevent next track to overwrite previous value
    if (!result[current] && ADMITTED_METADATA.includes(current)) {
      result[current] = data[key];
    }
  });

  return result;
}

async function upload(file, { name }, { transacting } = {}) {
  const { path, type } = file;
  const extension = mime.extension(type);

  const fileHandle = await leemons.fs.open(path, 'r');
  const stats = await fileHandle.stat(path);
  const fileSize = stats.size;

  let metadata = { size: getReadableFileSize(fileSize) };

  const [fileType] = type.split('/');

  // ·········································································
  // MEDIAINFO

  if (['image', 'audio', 'video'].includes(fileType)) {
    const mediainfo = await global.utils.mediaInfo({ format: 'JSON' });

    const readChunk = async (size, offset) => {
      const buffer = Buffer.alloc(size);
      await fileHandle.read(buffer, 0, size, offset);
      return buffer;
    };

    try {
      const metainfo = await mediainfo.analyzeData(() => fileSize, readChunk);
      const { track: tracks } = JSON.parse(metainfo).media;
      tracks.forEach((track) => {
        metadata = getMetaProps(track, metadata);
      });

      if (metadata.bitrate) {
        metadata.bitrate = getReadableBitrate(metadata.bitrate);
      }

      if (metadata.duration) {
        metadata.duration = getReadableDuration(Number(metadata.duration) * 1000);
      }
    } catch (err) {
      //
    } finally {
      if (fileHandle) await fileHandle.close();
      if (mediainfo) mediainfo.close();
    }
  }

  // ·········································································
  // DOCUMENT INFO

  if (['docx', 'docm', 'pptx', 'pptm', 'xlsx', 'xlsm'].includes(extension)) {
    const props = await global.utils.documentInfo.fromFilePath(path);
    metadata = getMetaProps(props, metadata);
  }

  // ·········································································

  const fileData = {
    provider: 'sys',
    name,
    type,
    extension,
    uri: '',
    metadata: JSON.stringify(metadata),
  };

  // EN: Firstly save the file to the database and get the id
  // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
  let newFile = await tables.files.create(fileData, { transacting });

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const { providerName } = await getSettings({ transacting });
  const urlData = {};

  if (providerName) {
    const provider = leemons.getProvider(providerName);
    if (provider?.services?.provider?.upload) {
      const buffer = await leemons.fs.readFile(path);
      urlData.provider = providerName;

      urlData.uri = await provider.services.provider.upload(newFile, buffer, { transacting });
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto
  if (urlData.uri === '') {
    // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
    urlData.provider = 'sys';
    urlData.uri = pathSys.resolve(__dirname, '..', '..', '..', 'files', newFile.id);
    await leemons.fs.copyFile(path, urlData.uri);
  }

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  newFile = await tables.files.update({ id: newFile.id }, urlData, { transacting });

  return { ...newFile, metadata };
}

module.exports = { upload };
