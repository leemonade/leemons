/**
 * @typedef LocalizationAdd
 * @property {[key: string]: string}
 */

/**
 * @typedef ManyResponse
 * @property {*[]} items
 * @property {number} count
 * @property {null | object} warnings
 */

/**
 * @typedef Role
 * @property {string} id Role id
 * @property {string} name Role name
 * @property {Date} created_at Date of role creation
 * @property {Date} updated_at Date of role update
 */

/**
 * @typedef RoleAdd
 * @param {string} name Role name
 * @param {object[]} permissions Permissions for role
 * @param {string} permissions.permissionName Permission name (For backend)
 * @param {string[]} permissions.actionNames Action names (For backend)
 * @param {string[]=} permissions.target Target id
 * @param {LocalizationAdd} localizationName
 */

/**
 * @typedef Permission
 * @property {string} id Permission id
 * @property {string} permissionName Permission name (For backend - Check if has this permission name)
 * @property {string} pluginName Plugin name (To group permissions by plugin)
 * @property {Date} created_at Date of permission creation
 * @property {Date} updated_at Date of permission update
 */

/**
 * @typedef PermissionAdd
 * @param {string} permissionName Permission name (For backend)
 * @param {string[]} actions Actions for this permission
 * @param {LocalizationAdd} localizationName
 */

/**
 * @typedef Action
 * @property {string} id Action id
 * @property {string} actionName Action name (For backend)
 * @property {Date} created_at Date of action creation
 * @property {Date} updated_at Date of action update
 */

/**
 * @typedef ActionAdd
 * @param {string} actionName Action name (For backend)
 * @param {LocalizationAdd} localizationName
 */

/**
 * @typedef User
 * @property {string} id User id
 * @property {string} name User name
 * @property {string} surnames User surnames
 * @property {string} email User email
 * @property {string} password User password
 * @property {boolean} reloadPermissions Define if need reload permissions
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
