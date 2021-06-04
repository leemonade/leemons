/**
 * @typedef Role
 * @property {string} id Role id
 * @property {string} name Role name
 * @property {Date} createdAt Date of role creation
 * @property {Date} updatedAt Date of role update
 */

/**
 * @typedef Permission
 * @property {string} id Permission id
 * @property {string} name Permission name (For frontend)
 * @property {string} permissionName Permission name (For backend - Check if has this permission name)
 * @property {string} pluginName Plugin name (To group permissions by plugin)
 * @property {Date} createdAt Date of permission creation
 * @property {Date} updatedAt Date of permission update
 */
