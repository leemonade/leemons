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
 * @property {string} description Role description
 * @property {string} center Role center id
 * @property {string} type Role type
 * @property {Date} created_at Date of role creation
 * @property {Date} updated_at Date of role update
 */

/**
 * @typedef RoleAdd
 * @type {Object}
 * @property {string} name Role name
 * @property {string} description Role description
 * @property {string} center Role center id
 * @property {string} type Role type
 * @property {RolePermissionsAdd} permissions Permissions for role
 */

/**
 * @typedef {RoleAdd} RoleUpdate
 * @property {string} id Role id
 */

/**
 * @typedef RolePermissionsAdd
 * @type {Object[]}
 * @property {string} permissionName Permission name (For backend)
 * @property {string[]} actionNames Action names (For backend)
 * @property {string} target Target id
 */

/**
 * @typedef {RolePermissionsAdd} UserAddCustomPermission
 * @property {string} center Center id
 */

/**
 * @typedef {UserAddCustomPermission} UserHasCustomPermission
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
 * @type {Object}
 * @property {string} permissionName Permission name (For backend)
 * @property {string[]} actions Actions for this permission
 * @property {LocalizationAdd} localizationName
 */

/**
 * @typedef ItemPermission
 * @type {Object}
 * @property {string} permissionName Permission name (For backend)
 * @property {string[]} actionNames Action names (For backend)
 * @property {string} target Target id
 * @property {string} type Type
 * @property {string} item Item that requires the user attempting to access to have the following permissions to be read
 */

/**
 * @typedef AddItemPermission
 * @type {Object}
 * @property {string} permissionName Permission name (For backend)
 * @property {string[]} actionNames Action names (For backend)
 * @property {string} target Target id
 * @property {string} center Center
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
 * @property {string} actionName Action name (For backend)
 * @property {number} order Order to show in frontend
 * @property {LocalizationAdd} localizationName
 */

/**
 * @typedef Center
 * @property {string} id Action id
 * @property {string} name Center name
 * @property {number} description Center description
 * @property {string} locale Center locale
 * @property {Date} created_at Date of center creation
 * @property {Date} updated_at Date of center update
 */

/**
 * @typedef CenterAdd
 * @property {string} name Center name
 * @property {number} description Center description
 * @property {string} locale Center locale
 * @property {string} email Center email
 *
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
 * @typedef UserAgentSession
 * @property {string} id User auth id
 * @property {string} user User relation
 * @property {string} role User auth role
 * @property {string} reloadPermissions Define if need reload the user auth permissions
 * @property {Date} created_at Date of permission creation
 * @property {Date} updated_at Date of permission update
 */

/**
 * @typedef UserSession
 * @property {string} id User id
 * @property {string} name User name
 * @property {string} surnames User surnames
 * @property {string} email User email
 * @property {string} locale User locale
 * @property {boolean} active User is active
 * @property {UserAgentSession[]} userAgents User auths for this session
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

/**
 * @typedef {array} ListOfUserPermissions
 * @property {string | undefined} role Role id
 * @property {string} permissionName Permission name
 * @property {string[]} actionNames Array of actions for the permission name
 * @property {string | undefined} target Target of permissions
 */

/**
 * @typedef AddUser
 * @property {string} name User name
 * @property {string | undefined} surnames User surnames
 * @property {string} email User email
 * @property {string} secondSurname Second surname
 * @property {string} avatar User avatar
 * @property {string} birthDate User birthDate
 * @property {string[]} tags User tags
 * @property {string} password User password
 * @property {string} language User locale language
 */

/**
 * @typedef ProfileAdd
 * @property {string} name Profile name
 * @property {string} description Profile description
 * @property {string} roles Profile roles ids
 */
