/**
 * @typedef LibraryProvider
 * @property {string} pluginName - Name of the plugin
 * @property {string} name - Human readable name of the service
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

/**
 * @typedef LibraryAsset
 * @property {string} id - Unique identifier for the asset
 * @property {string} deploymentID - Identifier for the deployment
 * @property {string} name - Name of the asset
 * @property {string} tagline - Tagline of the asset
 * @property {string} description - Description of the asset
 * @property {string} color - Color of the asset
 * @property {string} cover - Cover of the asset
 * @property {string} fromUser - User who created the asset
 * @property {string} fromUserAgent - User agent of the creator
 * @property {boolean} public - Whether the asset is public or not
 * @property {string} category - Category of the asset
 * @property {boolean} indexable - Whether the asset is indexable or not
 * @property {string} center - Center of the asset
 * @property {string} program - Program of the asset
 */

/**
 * @typedef LibraryCategory
 * @property {string} id - Unique identifier for the category
 * @property {string} deploymentID - Identifier for the deployment
 * @property {string} key - Key of the category
 * @property {string} pluginOwner - Plugin owner of the category
 * @property {boolean} creatable - Whether the category is creatable or not
 * @property {string} createUrl - URL for creating the category
 * @property {boolean} duplicable - Whether the category is duplicable or not
 * @property {string} provider - Provider of the category
 * @property {string} componentOwner - Component owner of the category
 * @property {string} listCardComponent - List card component of the category
 * @property {string} listItemComponent - List item component of the category
 * @property {string} detailComponent - Detail component of the category
 * @property {string} canUse - Can use property of the category
 * @property {number} order - Order of the category
 */

/**
 * @typedef {Object} LibraryPin
 * @property {string} id - The unique identifier of the pin.
 * @property {string} deploymentID - The identifier of the deployment.
 * @property {Object} asset - The asset associated with the pin.
 * @property {string} asset.specificType - The specific type of the asset.
 * @property {string} userAgent - The user agent string of the user who created the pin.
 */
