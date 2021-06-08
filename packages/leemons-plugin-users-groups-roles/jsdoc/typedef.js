/**
 * @typedef Role
 * @property {string} id Role id
 * @property {string} name Role name
 * @property {Date} created_at Date of role creation
 * @property {Date} updated_at Date of role update
 */

/**
 * @typedef Permission
 * @property {string} id Permission id
 * @property {string} name Permission name (For frontend)
 * @property {string} permissionName Permission name (For backend - Check if has this permission name)
 * @property {string} pluginName Plugin name (To group permissions by plugin)
 * @property {Date} created_at Date of permission creation
 * @property {Date} updated_at Date of permission update
 */

/**
 * @typedef User
 * @property {string} id User id
 * @property {string} name User name
 * @property {string} surnames User surnames
 * @property {string} email User email
 * @property {string} password User password
 * @property {Date} created_at Date of permission creation
 * @property {Date} updated_at Date of permission update
 */

/**
 * @typedef Group
 * @property {string} id User id
 * @property {string} name User name
 * @property {Date} created_at Date of permission creation
 * @property {Date} updated_at Date of permission update
 */
