/* eslint-disable no-param-reassign */
const { isEmpty } = require('lodash');
const mime = require('mime-types');
const pathSys = require('path');
const fsPromises = require('fs/promises');
const { findOne: getSettings } = require('../../settings');
const { getOptimizedImage } = require('./getOptimizedImage');
const { getReadableDuration } = require('./getReadableDuration');
const { getReadableBitrate } = require('./getReadableBitrate');
const { getMetaProps } = require('./getMetaProps');
const { createTemp } = require('./createTemp');
const { handleMetadata } = require('./handleMetadata');

// This mediainfo variable is set globally because we want to instanciate it
// and not create a new instance everytime the "analyzeFile" function is called
let mediainfo;

// -----------------------------------------------------------------------------
// PRIVATE METHODS

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

module.exports = { upload, prepareImage, uploadFromFileStream };
