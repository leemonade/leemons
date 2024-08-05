/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier of the user
 * @property {string} deploymentID - Deployment identifier
 * @property {string} name - Name of the user
 * @property {string} [surnames] - Surnames of the user
 * @property {string} [secondSurname] - Second surname of the user
 * @property {string} email - Email of the user
 * @property {string} [phone] - Phone number of the user
 * @property {string} [avatar] - Avatar URL of the user
 * @property {string} [avatarAsset] - Avatar asset of the user
 * @property {Date} birthdate - Birthdate of the user
 * @property {string} [password] - Password of the user
 * @property {string} locale - Locale of the user
 * @property {boolean} active - If the user is active
 * @property {string} [status] - Status of the user
 * @property {string} gender - Gender of the user
 */

/**
 * @typedef {Object} UserAgent
 * @property {string} id - Unique identifier of the user agent
 * @property {string} deploymentID - Deployment identifier
 * @property {string} user - Reference to the user
 * @property {string} role - Reference to the role
 * @property {boolean} [reloadPermissions=false] - If the permissions should be reloaded
 * @property {boolean} [datasetIsGood] - If the dataset is considered good
 * @property {boolean} [disabled=false] - If the user agent is disabled
 * @property {Profile} [profile] - Reference to the profile
 * @property {Center} [center] - Reference to the center
 * @property {Date} createdAt - Creation date of the user agent
 * @property {Date} updatedAt - Last update date of the user agent
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - Unique identifier of the profile
 * @property {string} deploymentID - Deployment identifier
 * @property {string} name - Name of the profile
 * @property {string} [description] - Description of the profile
 * @property {string} uri - URI of the profile
 * @property {string} [role] - Role associated with the profile
 * @property {boolean} indexable - If the profile is indexable
 * @property {'teacher' | 'student' | 'admin' | 'parent'} [sysName] - System name of the profile
 * @property {Date} createdAt - Creation date of the profile
 * @property {Date} updatedAt - Last update date of the profile
 */

/**
 * @typedef {Object} Role
 * @property {string} id - Unique identifier of the role
 * @property {string} deploymentID - Deployment identifier
 * @property {string} name - Name of the role
 * @property {string} type - Type of the role
 * @property {string} [description] - Description of the role
 * @property {string} uri - URI of the role
 */

/**
 * @typedef {Object} Center
 * @property {string} id - Unique identifier of the center. Required.
 * @property {string} deploymentID - Deployment identifier. Required.
 * @property {string} name - Name of the center. Required.
 * @property {string} [description] - Description of the center.
 * @property {string} locale - Locale of the center. Required.
 * @property {string} [email] - Email of the center.
 * @property {string} uri - URI of the center. Required.
 * @property {string} [timezone] - Timezone of the center.
 * @property {number} [firstDayOfWeek] - First day of the week for the center.
 * @property {string} [country] - Country of the center.
 * @property {string} [city] - City of the center.
 * @property {string} [postalCode] - Postal code of the center.
 * @property {string} [street] - Street of the center.
 * @property {string} [phone] - Phone number of the center.
 * @property {string} [contactEmail] - Contact email of the center.
 */

/**
 * @typedef {Object} CenterLimit
 * @property {string} id - Unique identifier of the center limit. Required.
 * @property {string} deploymentID - Deployment identifier. Required.
 * @property {string} center - Reference to the center. Required.
 * @property {string} type - Type of the limit, either 'group' or 'profile'. Required.
 * @property {string} item - Item associated with the limit.
 * @property {boolean} unlimited - If the limit is unlimited.
 * @property {number} limit - Specific limit value.
 * @property {Date} createdAt - Creation date of the center limit.
 * @property {Date} updatedAt - Last update date of the center limit.
 */
