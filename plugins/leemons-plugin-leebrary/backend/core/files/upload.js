/* eslint-disable no-param-reassign */
const { toLower, isEmpty } = require('lodash');
const mime = require('mime-types');
const pathSys = require('path');
const stream = require('stream');
const fs = require('fs');
const fsPromises = require('fs/promises');
const temp = require('temp');
// const mediainfo = require('mediainfo.js')({ format: 'JSON' });
const document = require('office-document-properties');
const got = require('got');
const sharp = require('sharp');

const { LeemonsError } = require('leemons-error');
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

/**
 * Retrieves optimized image stream from the given path with the specified extension.
 *
 * @function getOptimizedImage
 * @param {string} path - The path to the image file.
 * @param {string} [extension] - The extension of the image file. If not provided, 'jpeg' will be used as default.
 * @returns {stream.Readable} A readable stream containing the optimized image.
 */
function getOptimizedImage(path, extension) {
  let imageStream = sharp();

  if (path && !isEmpty(path)) {
    imageStream = sharp(path);
  }

  return imageStream
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .toFormat(extension || 'jpeg', { quality: 70 });
}

/**
 * Converts milliseconds to a readable duration format (HH:mm:ss).
 *
 * @function getReadableDuration
 * @param {number} milliseconds - The duration in milliseconds.
 * @param {boolean} [padStart=false] - Whether to pad the hours with leading zeros if less than 10.
 * @returns {string} A string representing the readable duration in the format HH:mm:ss.
 */
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

/**
 * Converts a bitrate value to a human-readable format (e.g., kbps, Mbps).
 *
 * @function getReadableBitrate
 * @param {number} bitrate - The bitrate value to convert.
 * @returns {string} A string representing the human-readable bitrate format.
 */
function getReadableBitrate(bitrate) {
  let i = -1;
  const byteUnits = [' kbps', ' Mbps', ' Gbps', ' Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps'];
  do {
    bitrate /= 1000;
    i++;
  } while (bitrate > 1000);

  return Math.max(bitrate, 0.1).toFixed(1) + byteUnits[i];
}

/**
 * Converts a file size in bytes to a human-readable format (e.g., KB, MB, GB).
 *
 * @function getReadableFileSize
 * @param {number} bytes - The file size in bytes.
 * @returns {string} A string representing the human-readable file size format.
 */
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

/**
 * Extracts selected metadata properties from the data object and returns them as a new object.
 *
 * @function getMetaProps
 * @param {Object} data - The data object from which to extract the metadata properties.
 * @param {Object} [result={}] - An optional object to store the extracted metadata properties.
 * @returns {Object} An object containing the extracted metadata properties.
 */
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

/**
 * Retrieves the content type of a remote file specified by the URL.
 *
 * @async
 * @function getRemoteContentType
 * @param {string} url - The URL of the remote file.
 * @returns {Promise<string>} A promise that resolves to the content type of the remote file.
 */
function getRemoteContentType(url) {
  return new Promise((resolve, reject) => {
    try {
      got(url, { isStream: true })
        .on('response', (response) => {
          response.destroy();
          resolve(response.headers['content-type']);
        })
        .on('error', (error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Downloads a file from a remote URL and returns a readable stream of the downloaded file.
 *
 * @async
 * @function download
 * @param {string} url - The URL of the file to be downloaded.
 * @param {boolean} compress - Whether to compress the downloaded file if it is an image.
 * @returns {Promise<{stream: stream.Readable, path: string, contentType: string}>} A promise that resolves to an object containing the readable stream, temporary path, and content type of the downloaded file.
 */
function download(url, compress) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const downloadStream = got(url, { isStream: true });
        const fileWriterStream = temp.createWriteStream();
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
      } catch (error) {
        reject(error);
      }
    })();
  });
}

/**
 * Checks if an object is a readable stream.
 *
 * @function isReadableStream
 * @param {Object} obj - The object to check.
 * @returns {boolean} `true` if the object is a readable stream, otherwise `false`.
 */
function isReadableStream(obj) {
  return (
    obj instanceof stream.Stream &&
    typeof (obj._read === 'function') &&
    typeof (obj._readableState === 'object')
  );
}

/**
 * Converts a readable stream to a buffer.
 *
 * @async
 * @function streamToBuffer
 * @param {stream.Readable} readStream - The readable stream to convert.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the data from the readable stream.
 */
function streamToBuffer(readStream) {
  return new Promise((resolve, reject) => {
    const data = [];

    readStream.on('data', (chunk) => {
      data.push(chunk);
    });

    readStream.on('end', () => {
      resolve(Buffer.concat(data));
    });

    readStream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Creates a temporary file from a readable stream.
 *
 * @async
 * @function createTemp
 * @param {stream.Readable} readStream - The readable stream to create the temporary file from.
 * @param {string} contentType - The content type of the data in the readable stream.
 * @returns {Promise<{path: string, contentType: string}>} A promise that resolves to an object containing the temporary file path and content type.
 */
function createTemp(readStream, contentType) {
  return new Promise((resolve, reject) => {
    temp.open('leebrary', async (err, info) => {
      if (err) {
        reject(err);
      }

      let dataToWrite = readStream;

      if (isReadableStream(dataToWrite)) {
        dataToWrite = await streamToBuffer(dataToWrite);
      }

      fs.write(info.fd, dataToWrite, (e) => {
        if (e) {
          reject(e);
        }

        fs.close(info.fd, (error) => {
          if (error) {
            reject(error);
          }
          resolve({ path: info.path, contentType });
        });
      });
    });
  });
}

/**
 * Retrieves document properties from a file path using the "office-document-properties" library.
 *
 * @async
 * @function documentInfofromFilePath
 * @param {string} path - The path to the file.
 * @returns {Promise<Object>} A promise that resolves to an object containing the document properties.
 */
function documentInfofromFilePath(path) {
  return new Promise((resolve, reject) => {
    document.fromFilePath(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

/**
 * Uploads a file to the system.
 *
 * @async
 * @function upload
 * @param {Object} options - Input options.
 * @param {string} options.path - The path to the file to be uploaded.
 * @param {string} options.type - The MIME type of the file.
 * @param {string} options.name - The name of the file.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object>} A promise that resolves to an object containing information about the uploaded file, including its ID and metadata.
 */
async function upload({ path, type, name, ctx }) {
  const extension = mime.extension(type);

  const fileHandle = await fsPromises.open(path, 'r');
  const stats = await fileHandle.stat(path);
  const fileSize = stats.size;

  let metadata = {};

  if (fileSize) {
    metadata.size = getReadableFileSize(fileSize);
  }

  const [fileType] = type.split('/');

  // ·········································································
  // MEDIAINFO

  if (['image', 'audio', 'video'].includes(fileType)) {
    const readChunk = async (size, offset) => {
      const buffer = Buffer.alloc(size);
      await fileHandle.read(buffer, 0, size, offset);
      return buffer;
    };

    try {
      if (!fileSize) throw new LeemonsError(ctx, { message: 'No file size' });

      const metainfo = await mediainfo.analyzeData(() => fileSize, readChunk);

      const { track: tracks } = JSON.parse(metainfo)?.media || { track: [] };
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
      // eslint-disable-next-line no-console
      console.error('-- ERROR: obtaining metadata --');
      // eslint-disable-next-line no-console
      console.log(err);
    }

    if (fileHandle) await fileHandle.close();
    if (mediainfo) await mediainfo.close();
  }

  // ·········································································
  // DOCUMENT INFO

  if (['docx', 'docm', 'pptx', 'pptm', 'xlsx', 'xlsm'].includes(extension)) {
    const props = await documentInfofromFilePath(path);
    metadata = getMetaProps(props, metadata);
  }
  // ·········································································

  const fileData = {
    provider: 'sys',
    name,
    type,
    extension,
    uri: '',
    size: fileSize,
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
  let newFile = await ctx.tx.db.Files.create(fileData);
  newFile = newFile.toObject();

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const settings = await getSettings({ ctx });
  const urlData = {};

  if (settings?.providerName) {
    // TODO Roberto: Hay que repensar esta lógica en la que se solicita los plugins Providers de un determinado plugin
    // Lanzo el error aposta
    throw new Error('TODO: HAY QUE REPENSAR LA LÓGICA DE LOS PROVIDERS');
    //! Dejo comentado el código "antiguo"
    /*
    const provider = leemons.getProvider(settings.providerName);
    if (provider?.services?.provider?.upload) {
      const buffer = await fsPromises.readFile(path);
      urlData.provider = settings.providerName;

      urlData.uri = await provider.services.provider.upload(newFile, buffer, { transacting });
    }
    */
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

    const buffer = await fsPromises.readFile(path);
    await fsPromises.writeFile(urlData.uri, buffer);
  }

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  newFile = await ctx.tx.db.Files.findOneAndUpdate({ id: newFile.id }, urlData, {
    new: true,
    lean: true,
  });

  return { ...newFile, metadata };
}

/**
 * Uploads an image to the system and optimizes it.
 *
 * @async
 * @function uploadImage
 * @param {string} path - The path to the image file to be uploaded.
 * @param {string} extension - The extension of the image file.
 * @returns {Promise<Object>} A promise that resolves to an object containing the temporary path of the optimized image.
 */
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

/**
 * Uploads a file from a file stream to the system.
 *
 * @async
 * @function uploadFromFileStream
 * @param {Object} options - Input options.
 * @param {Object} options.file - The file stream object to be uploaded.
 * @param {string} options.name - The name of the file.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object>} A promise that resolves to an object containing information about the uploaded file, including its ID and metadata.
 */
async function uploadFromFileStream({ file, name, ctx }) {
  const { readStream, contentType } = file;

  const { path } = await createTemp(readStream, contentType);
  return upload({ path, type: contentType, name, ctx });
}

/**
 * Uploads a file from a URL to the system.
 *
 * @async
 * @function uploadFromUrl
 * @param {Object} options - Input options.
 * @param {string} options.url - The URL of the file to be downloaded and uploaded.
 * @param {string} options.name - The name of the file.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object>} A promise that resolves to an object containing information about the uploaded file, including its ID and metadata.
 */
async function uploadFromUrl({ url, name, ctx }) {
  // ES: Primero comprobamos que la URL no sea un FILE_ID
  // EN: First check if the URL is a FILE_ID
  const file = await getById({ id: url, ctx });

  if (file?.id) {
    const fileStream = await dataForReturnFile({ id: file.id, ctx });
    return uploadFromFileStream({ file: fileStream, name, ctx });
  }
  try {
    const { path, contentType } = await download(url, true);

    return await upload({ path, type: contentType, name, ctx });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ERROR: downloading file:', url);
    // eslint-disable-next-line no-console
    console.dir(url, { depth: null });
    throw new Error(`-- ERROR: downloading file ${url} --`);
  }
}

module.exports = { upload, uploadFromUrl, uploadFromFileStream, uploadImage };
