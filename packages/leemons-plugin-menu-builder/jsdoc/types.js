/**
 * @typedef LocalizationAdd
 * @property {[key: string]: string}
 */

/**
 * @typedef Menu
 * @property {string} key
 * @property {string | undefined} [id] The Menu internal id
 */

/**
 * @typedef MenuItem
 * @property {string} pluginName
 * @property {string} name
 * @property {string} slug
 * @property {number | undefined} order
 * @property {boolean | undefined} fixed
 * @property {string | undefined} iconName
 * @property {string | undefined} iconSvg
 * @property {string | undefined} url
 * @property {string | undefined} window
 * @property {string | undefined} parentId The Parent's MenuItem ID
 * @property {string | undefined} [id] The MenuItem internal ID
 */

/**
 * @typedef MenuPermissionsAdd
 * @type {Object[]}
 * @property {string} permissionName Permission name (For backend)
 * @property {string[]} actionNames Action names (For backend)
 * @property {string} target Target id
 */

/**
 * @typedef MenuItemAdd
 * @property {string} menuKey
 * @property {string | undefined} key Identifier key
 * @property {string | undefined} parentKey The Parent's key
 * @property {string} pluginName
 * @property {number | undefined} order
 * @property {boolean | undefined} fixed
 * @property {string | undefined} iconName
 * @property {string | undefined} iconSvg
 * @property {string | undefined} url
 * @property {string | undefined} window
 * @property {boolean | undefined} disabled
 * @property {LocalizationAdd} label
 * @property {LocalizationAdd | undefined} description
 */
