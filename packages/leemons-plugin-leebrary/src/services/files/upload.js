/* eslint-disable no-param-reassign */
const { toLower, isEmpty } = require('lodash');
const mime = require('mime-types');
const pathSys = require('path');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');
const { getById } = require('./getById');
const { dataForReturnFile } = require('./dataForReturnFile');

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
  'height',
  'width',
  'bitrate',
  // 'channels',
];

// -----------------------------------------------------------------------------
// HELPERS

function getOptimizedImage(path, extension) {
  let stream = global.utils.sharp();

  if (path && !isEmpty(path)) {
    stream = global.utils.sharp(path);
  }

  return stream
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .toFormat(extension || 'jpeg', { quality: 70 });
}

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

function getRemoteContentType(url) {
  return new Promise((resolve, reject) => {
    global.utils
      .got(url, { isStream: true })
      .on('response', (response) => {
        response.destroy();
        resolve(response.headers['content-type']);
      })
      .on('error', (error) => reject(error));
  });
}

function download(url, compress) {
  return new Promise((resolve, reject) => {
    (async () => {
      const downloadStream = global.utils.got(url, { isStream: true });
      const fileWriterStream = leemons.fs.createTempWriteStream();
      const contentType = await getRemoteContentType(url);

      const [fileType] = contentType.split('/');
      const extension = mime.extension(contentType);

      downloadStream.on('error', (error) => reject(error));

      fileWriterStream
        .on('error', (error) => reject(error))
        .on('finish', () => {
          fileWriterStream.end();
          resolve({ stream: fileWriterStream, path: fileWriterStream.path, contentType });
        });

      if (compress && fileType === 'image' && ['jpeg', 'jpg', 'png'].includes(extension)) {
        downloadStream.pipe(getOptimizedImage(null, extension)).pipe(fileWriterStream);
      } else {
        downloadStream.pipe(fileWriterStream);
      }
    })();
  });
}

function createTemp(readStream, contentType) {
  return new Promise((resolve, reject) => {
    leemons.fs.openTemp('leebrary', (err, info) => {
      if (err) {
        reject(err);
      }

      leemons.fs.write(info.fd, readStream, (e) => {
        if (e) {
          reject(e);
        }

        leemons.fs.close(info.fd, (error) => {
          if (error) {
            reject(error);
          }
          resolve({ path: info.path, contentType });
        });
      });
    });
  });
}

// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

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
    let mediainfo;

    const readChunk = async (size, offset) => {
      const buffer = Buffer.alloc(size);
      await fileHandle.read(buffer, 0, size, offset);
      return buffer;
    };

    try {
      mediainfo = await global.utils.mediaInfo({ format: 'JSON' });
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
    }

    if (fileHandle) await fileHandle.close();
    if (mediainfo) await mediainfo.close();
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

  /*
  if (userSession) {
    fileData.fromUser = userSession.id;
    fileData.fromUserAgent =
      userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  }
  */

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
  if (isEmpty(urlData.uri)) {
    // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
    urlData.provider = 'sys';
    urlData.uri = pathSys.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'files',
      `${newFile.id}.${newFile.extension}`
    );

    const buffer = await leemons.fs.readFile(path);
    await leemons.fs.writeFile(urlData.uri, buffer);
  }

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  newFile = await tables.files.update({ id: newFile.id }, urlData, { transacting });

  return { ...newFile, metadata };
}

function uploadImage(path, extension) {
  return new Promise((resolve, reject) => {
    const fileWriterStream = leemons.fs.createTempWriteStream();

    fileWriterStream
      .on('error', (error) => reject(error))
      .on('finish', () => {
        fileWriterStream.end();
        resolve({ path: fileWriterStream.path });
      });

    getOptimizedImage(path, extension).pipe(fileWriterStream);
  });
}

async function uploadFromFileStream(file, { name }, { userSession, transacting } = {}) {
  const { readStream, contentType } = file;

  const { path } = await createTemp(readStream, contentType);

  return upload({ path, type: contentType }, { name }, { userSession, transacting });
}

async function uploadFromUrl(url, { name }, { userSession, transacting } = {}) {
  // ES: Primero comprobamos que la URL no sea un FILE_ID
  // EN: First check if the URL is a FILE_ID
  const file = await getById(url);

  if (file?.id) {
    const fileStream = await dataForReturnFile(file.id);
    return uploadFromFileStream(fileStream, { name }, { userSession, transacting });
  }

  const { path, contentType } = await download(url, true);

  return upload({ path, type: contentType }, { name }, { userSession, transacting });
}

module.exports = { upload, uploadFromUrl, uploadFromFileStream, uploadImage };
