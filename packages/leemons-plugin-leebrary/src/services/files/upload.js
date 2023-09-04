/* eslint-disable no-param-reassign */
const { toLower, isEmpty } = require('lodash');
const mime = require('mime-types');
const pathSys = require('path');
const stream = require('stream');
const fs = require('fs');
const fsPromises = require('fs/promises');
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

// This mediainfo variable is set globally because we want to instanciate it
// and not create a new instance everytime the "analyzeFile" function is called
let mediainfo;

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Optimizes an image by resizing it and changing its format and quality.
 *
 * @param {Object} params - The params object.
 * @param {string} params.path - The path of the image.
 * @param {string} params.extension - The extension of the image.
 * @returns {Object} The optimized image stream.
 */
function getOptimizedImage({ path, extension }) {
  const defaultExtension = 'jpeg';
  const defaultQuality = 70;
  const resizeOptions = { fit: 'inside', withoutEnlargement: true };
  const resizeDimensions = { width: 1024, height: 1024 };

  const imageStream = path && !isEmpty(path) ? global.utils.sharp(path) : global.utils.sharp();

  return imageStream
    .resize(resizeDimensions, resizeOptions)
    .toFormat(extension || defaultExtension, { quality: defaultQuality });
}

/**
 * Pads a number with leading zeros.
 *
 * @param {number} num - The number to pad.
 * @returns {string} The padded number as a string.
 */
function pad(num) {
  return `${num}`.padStart(2, '0');
}

/**
 * Converts milliseconds to a readable duration format (HH:MM:SS or MM:SS).
 *
 * @param {Object} params - The params object
 * @param {number} params.duration - The duration in milliseconds.
 * @param {boolean} params.padStart - Whether to pad the hours with leading zeros.
 * @returns {string} The duration in a readable format.
 */
function getReadableDuration({ duration, padStart }) {
  const asSeconds = duration / 1000;

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
 * Converts bitrate to a readable format (kbps, Mbps, Gbps, etc.).
 *
 * @param {number} bitrate - The bitrate in bps.
 * @returns {string} The bitrate in a readable format.
 */
function getReadableBitrate(bitrate) {
  let i = -1;
  const byteUnits = ['kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps'];
  do {
    bitrate /= 1000;
    i++;
  } while (bitrate > 1000);

  return `${Math.max(bitrate, 0.1).toFixed(1)} ${byteUnits[i]}`;
}

/**
 * Converts file size to a readable format (KB, MB, GB, etc.).
 *
 * @param {number} size - The file size in bytes.
 * @returns {string} The file size in a readable format.
 */
function getReadableFileSize(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return `${(size / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}

/**
 * Extracts metadata from the provided data object and merges it into the result object.
 * Only metadata keys that are included in the ADMITTED_METADATA array are considered.
 * If a key already exists in the result object, it will not be overwritten.
 *
 * @param {Object} data - The data object containing metadata.
 * @param {Object} [result={}] - The result object to merge the metadata into.
 * @returns {Object} The result object with the merged metadata.
 */
function getMetaProps({ data, result = {} }) {
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
 * Fetches the content type of a remote file.
 *
 * @param {string} url - The URL of the remote file.
 * @returns {Promise<string>} The content type of the remote file.
 */
function getRemoteContentType(url) {
  return new Promise((resolve, reject) => {
    try {
      global.utils
        .got(url, { isStream: true })
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
 * Downloads a file from a given URL and optionally compresses it if it's an image.
 *
 * @param {object} params - The params object.
 * @param {string} params.url - The URL of the file to download.
 * @param {boolean} params.compress - Whether to compress the file if it's an image.
 * @returns {Promise<Object>} A promise that resolves with an object containing the downloaded file's stream, path, and content type.
 */
function download({ url, compress }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
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
          downloadStream.pipe(getOptimizedImage({ path: null, extension })).pipe(fileWriterStream);
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
 * Checks if the provided object is a readable stream.
 *
 * @param {Object} obj - The object to check.
 * @returns {boolean} True if the object is a readable stream, false otherwise.
 */
function isReadableStream(obj) {
  return (
    obj instanceof stream.Stream &&
    typeof (obj._read === 'function') &&
    typeof (obj._readableState === 'object')
  );
}

/**
 * Converts a readable stream into a buffer.
 *
 * @param {stream.Readable} readStream - The readable stream to convert.
 * @returns {Promise<Buffer>} A promise that resolves with the buffer.
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
 * Creates a temporary file from a readable stream or a buffer.
 *
 * @param {object} params - The params object.
 * @param {stream.Readable|Buffer} params.readStream - The readable stream or buffer.
 * @param {string} params.contentType - The content type of the file.
 * @returns {Promise<Object>} A promise that resolves with an object containing the path and content type of the temporary file.
 */
function createTemp({ readStream, contentType }) {
  return new Promise((resolve, reject) => {
    leemons.fs.openTemp('leebrary', async (err, info) => {
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
 * Handles the metadata of a file.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.fileHandle - The file handle.
 * @param {string} params.path - The path of the file.
 * @returns {Promise<Object>} The metadata and size of the file.
 */
async function handleMetadata({ fileHandle, path }) {
  const stats = await fileHandle.stat(path);
  const fileSize = stats.size;
  const metadata = {};

  if (fileSize) {
    metadata.size = getReadableFileSize(fileSize);
  }

  return { metadata, fileSize };
}

/**
 * Analyzes the file and extracts metadata if it's an image, audio, or video file.
 *
 * @param {Object} params - The params object
 * @param {Object} params.metadata - The metadata of the file.
 * @param {Object} params.fileHandle - The file handle.
 * @param {string} params.fileType - The type of the file.
 * @param {number} params.fileSize - The size of the file.
 * @returns {Promise<Object>} The metadata of the file.
 */
async function handleMediaInfo({ metadata = {}, fileHandle, fileType, fileSize }) {
  if (['image', 'audio', 'video'].includes(fileType)) {
    const readChunk = async (size, offset) => {
      const buffer = Buffer.alloc(size);
      await fileHandle.read(buffer, 0, size, offset);
      return buffer;
    };

    try {
      if (!fileSize) throw new Error('No file size');
      if (!mediainfo) {
        mediainfo = await global.utils.mediaInfo({ format: 'JSON' });
      }

      const metainfo = await mediainfo.analyzeData(() => fileSize, readChunk);
      const { track: tracks } = JSON.parse(metainfo)?.media || { track: [] };
      tracks.forEach((track) => {
        metadata = getMetaProps({ data: track, result: metadata });
      });

      if (metadata.bitrate) {
        metadata.bitrate = getReadableBitrate(metadata.bitrate);
      }

      if (metadata.duration) {
        metadata.duration = getReadableDuration({ duration: Number(metadata.duration) * 1000 });
      }
    } catch (err) {
      console.error('-- ERROR: obtaining metadata --');
      console.log(err);
    }

    if (fileHandle) await fileHandle.close();
    if (mediainfo) await mediainfo.close();
  }

  return metadata;
}

/**
 * Handles the file provider for file upload.
 *
 * @param {Object} params - The parameters for the file provider.
 * @param {Object} params.newFile - The new file to be uploaded.
 * @param {Object} params.settings - The settings for the file provider.
 * @param {string} params.path - The path of the file.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object>} The URL data of the uploaded file.
 */
async function handleFileProvider({ newFile, settings, path, transacting }) {
  const urlData = {};

  if (settings?.providerName) {
    const provider = leemons.getProvider(settings.providerName);
    if (provider?.services?.provider?.upload) {
      const buffer = await fsPromises.readFile(path);
      urlData.provider = settings.providerName;

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

    const buffer = await fsPromises.readFile(path);
    await fsPromises.writeFile(urlData.uri, buffer);
  }

  return urlData;
}

/**
 * Handles the document information and extracts metadata if it's a docx, docm, pptx, pptm, xlsx, or xlsm file.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.metadata - The metadata of the file.
 * @param {string} params.path - The path of the file.
 * @param {string} params.extension - The extension of the file.
 * @returns {Promise<Object>} The metadata of the file.
 */
async function handleDocumentInfo({ metadata, path, extension }) {
  if (['docx', 'docm', 'pptx', 'pptm', 'xlsx', 'xlsm'].includes(extension)) {
    const props = await global.utils.documentInfo.fromFilePath(path);
    metadata = getMetaProps({ data: props, result: metadata });
  }

  return metadata;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Uploads a file.
 *
 * @param {Object} file - The file to upload.
 * @param {Object} data - The data for the upload.
 * @param {string} data.name - The name of the file.
 * @param {Object} options - The options for the upload.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The uploaded file.
 */
async function upload(file, { name }, { transacting } = {}) {
  const { path, type } = file;
  const extension = mime.extension(type);
  const fileHandle = await fsPromises.open(path, 'r');
  const [fileType] = type.split('/');

  // eslint-disable-next-line prefer-const
  let { metadata, fileSize } = await handleMetadata({ fileHandle, path });

  // ·········································································
  // MEDIAINFO

  metadata = await handleMediaInfo({ metadata, fileHandle, fileType, fileSize });

  // ·········································································
  // DOCUMENT INFO

  metadata = await handleDocumentInfo({ metadata, path, extension });

  // ·········································································
  // CREATE NEW FILE IN DB

  const fileData = {
    provider: 'sys',
    name,
    type,
    extension,
    uri: '',
    size: fileSize,
    metadata: JSON.stringify(metadata),
  };

  // EN: Firstly save the file to the database and get the id
  // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
  let newFile = await tables.files.create(fileData, { transacting });

  // ·········································································
  // UPLOAD THE FILE

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const settings = await getSettings({ transacting });
  const urlData = await handleFileProvider({ newFile, settings, path, transacting });

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  newFile = await tables.files.update({ id: newFile.id }, urlData, { transacting });

  return { ...newFile, metadata };
}

/**
 * Creates a temporary file from an image and optimizes it.
 *
 * @param {Object} params - The params object
 * @param {string} params.path - The path of the image.
 * @param {string} params.extension - The extension of the image.
 * @returns {Promise<Object>} A promise that resolves with an object containing the path of the temporary file.
 */
async function prepareImage({ path, extension }) {
  try {
    const fileWriterStream = leemons.fs.createTempWriteStream();

    await new Promise((resolve, reject) => {
      fileWriterStream.on('error', reject).on('finish', resolve);

      getOptimizedImage({ path, extension }).pipe(fileWriterStream);
    });

    return { path: fileWriterStream.path };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Uploads a file from a given file stream.
 *
 * @param {Object} file - The file stream to upload.
 * @param {Object} params - The parameters for the upload.
 * @param {string} params.name - The name of the file.
 * @param {Object} options - The options for the upload.
 * @param {Object} options.userSession - The user session object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} A promise that resolves with the uploaded file.
 */
async function uploadFromFileStream(file, { name }, { userSession, transacting } = {}) {
  const { readStream, contentType } = file;
  const { path } = await createTemp({ readStream, contentType });

  return upload({ path, type: contentType }, { name }, { userSession, transacting });
}

/**
 * Uploads a file from a given URL.
 *
 * @param {string} url - The URL of the file to upload.
 * @param {Object} params - The parameters for the upload.
 * @param {string} params.name - The name of the file.
 * @param {Object} options - The options for the upload.
 * @param {Object} options.userSession - The user session object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} A promise that resolves with the uploaded file.
 */
async function uploadFromUrl(url, { name }, { userSession, transacting } = {}) {
  // ES: Primero comprobamos que la URL no sea un FILE_ID
  // EN: First check if the URL is a FILE_ID
  const file = await getById(url);

  try {
    if (file?.id) {
      if (file.isFolder) {
        return file;
      }

      const fileStream = await dataForReturnFile(file.id);
      return uploadFromFileStream(fileStream, { name }, { userSession, transacting });
    }

    const { path, contentType } = await download({ url, compress: true });
    return upload({ path, type: contentType }, { name }, { userSession, transacting });
  } catch (err) {
    console.error('ERROR: downloading file:', url);
    console.dir(url, { depth: null });
    throw new Error(`-- ERROR: downloading file ${url} --`);
  }
}

module.exports = { upload, prepareImage, uploadFromFileStream, uploadFromUrl };
