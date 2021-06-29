/**
 * @typedef DatasetSchema
 * @property {string} locationName Location name (For backend)
 * @property {string} pluginName Plugin name (For backend)
 * @property {any} jsonSchema JSON schema
 * @property {any} jsonUI JSON ui
 * @property {Date} created_at Date of dataset location creation
 * @property {Date} updated_at Date of dataset location update
 */

/**
 * @typedef DatasetLocation
 * @property {string} name Location name (For frontend)
 * @property {string} description Location description (For frontend)
 * @property {string} locationName Location name (For backend)
 * @property {string} plugin Plugin that records the location
 * @property {Date} created_at Date of dataset location creation
 * @property {Date} updated_at Date of dataset location update
 */

/**
 * @typedef DatasetAddLocation
 * @property {[locale: string]: string} name Location name (For frontend)
 * @property {[locale: string]: string} description Location description (For frontend)
 * @property {string} locationName Location name (For backend)
 * @property {string} pluginName Plugin name (For backend)
 */

/**
 * @typedef {DatasetAddLocation} DatasetUpdateLocation
 */

/**
 * @typedef DatasetAddSchema
 * @property {string} locationName Location name (For backend)
 * @property {string} pluginName Plugin name (For backend)
 * @property {any} jsonSchema Json schema for create and validate dataset form
 * @property {any} jsonUI Json schema for ui
 * @property {string} locale Json schema locale
 */

/**
 * @typedef {DatasetAddSchema} DatasetUpdateSchema
 */

/**
 * @typedef DatasetAddSchemaLocale
 * @property {string} locationName Location name (For backend)
 * @property {string} pluginName Plugin name (For backend)
 * @property {any} schemaData Json data
 * @property {any} uiData Json data
 * @property {string} locale Json locale
 */

/**
 * @typedef DatasetDeleteSchemaLocale
 * @property {string} locationName Location name (For backend)
 * @property {string} pluginName Plugin name (For backend)
 * @property {string} locale Json locale
 */
