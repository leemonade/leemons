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
