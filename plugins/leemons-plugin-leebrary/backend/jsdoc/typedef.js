/**
 * @typedef LibraryProvider
 * @property {string} name - Name of the service
 * @property {string} image - URL of the service logo
 * @property {Object} supportedMethods - Object containing supported methods
 * @property {boolean} supportedMethods.uploadMultipartChunk - Supports uploading multipart chunks
 * @property {boolean} supportedMethods.finishMultipart - Supports finishing multipart upload
 * @property {boolean} supportedMethods.abortMultipart - Supports aborting multipart upload
 * @property {boolean} supportedMethods.getS3AndConfig - Supports getting S3 and config
 * @property {boolean} supportedMethods.getReadStream - Supports getting read stream
 * @property {boolean} supportedMethods.removeConfig - Supports removing config
 * @property {boolean} supportedMethods.newMultipart - Supports creating new multipart upload
 * @property {boolean} supportedMethods.getConfig - Supports getting config
 * @property {boolean} supportedMethods.setConfig - Supports setting config
 * @property {boolean} supportedMethods.upload - Supports upload
 * @property {boolean} supportedMethods.remove - Supports remove
 * @property {boolean} supportedMethods.clone - Supports clone
 */
/**
 * @typedef LibraryFile
 * @property {string} id - Unique identifier for the file
 * @property {string} deploymentID - Identifier for the deployment
 * @property {string} provider - Name of the service provider
 * @property {string} type - Type of the file
 * @property {string} extension - File extension
 * @property {string} name - Name of the file
 * @property {number} size - Size of the file, default is 0
 * @property {string} uri - URI of the file
 * @property {string} metadata - Metadata of the file
 */
