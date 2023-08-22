const { groupBy, uniq } = require('lodash');
const { normalizeItemsArray } = require('../shared');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Get class information by class id
 * @param {Array} classes - Array of class ids
 * @param {Object} options - Options object
 * @param {Object} options.userSession - User session object
 * @param {Object} options.transacting - Transaction object
 * @returns {Promise<Object>} - Class data
 */
async function getClassInfo(classes, { userSession, transacting }) {
  const { services: apServices } = leemons.getPlugin('academic-portfolio');
  const classesInfo = await apServices.classes.classByIds(classes, {
    userSession,
    transacting,
  });

  const classesData = {};
  classesInfo.forEach((klass) => {
    classesData[klass.id] = {
      id: klass.id,
      subject: klass.subject.id,
      fullName: klass.groups.isAlone
        ? klass.subject.name
        : `${klass.subject.name} - ${klass.groups.name}`,
      icon: klass.subject.icon,
      color: klass.color,
    };
  });
  return classesData;
}

/**
 * Get permissions by asset id
 * @param {Array} ids - Array of asset ids
 * @param {Object} options - Options object
 * @param {Object} options.transacting - Transaction object
 * @returns {Promise<Array>} - Array of permissions
 */
async function getPermissions(ids, { transacting }) {
  const { services: userService } = leemons.getPlugin('users');
  return await userService.permissions.findItems(
    {
      item_$in: ids,
      permissionName_$startsWith: 'plugins.academic-portfolio.class.',
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );
}

/**
 * Get class data based on permissions
 * @param {Array} permissions - Array of permissions
 * @param {Object} options - Options object
 * @param {Object} options.userSession - User session object
 * @param {Object} options.transacting - Transaction object
 * @returns {Promise<Object>} - Class data if classes exist, otherwise an empty object
 */
async function getClassData(permissions, { userSession, transacting }) {
  const classes = uniq(permissions.map(permission => permission.permissionName.replace(`plugins.academic-portfolio.class.`, '')));
  return classes.length ? await getClassInfo(classes, { userSession, transacting }) : {};
}

/**
 * Maps permissions to roles and class data
 * @param {Array} permissions - Array of permissions
 * @param {Object} classesData - Object containing class data
 * @returns {Array} - Array of objects containing class data and role
 */
function mapPermissionsToRoles(permissions, classesData) {
  return permissions?.map(permission => {
    const role = getRole(permission);
    const classId = permission.permissionName.replace(`plugins.academic-portfolio.class.`, '');
    return {
      ...classesData[classId],
      class: classId,
      role,
    };
  }) ?? [];
}

/**
 * Determines the role based on the permission type
 * @param {Object} permission - Permission object
 * @returns {string} - Role ('editor', 'assigner', or 'viewer')
 */
function getRole(permission) {
  if (permission.type === leemons.plugin.prefixPN('asset.can-edit')) return 'editor';
  if (permission.type === leemons.plugin.prefixPN('asset.can-assign')) return 'assigner';
  return 'viewer';
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Get class permissions
 * @param {Array} assetsIds - Array of asset ids
 * @param {Object} options - Options object
 * @param {Boolean} options.withInfo - Flag to include class info
 * @param {Object} options.transacting - Transaction object
 * @param {Object} options.userSession - User session object
 * @returns {Promise<Array>} - Array of permissions by asset
 */
async function getClassesPermissions(assetsIds, { withInfo, transacting, userSession }) {
  const ids = normalizeItemsArray(assetsIds);
  const permissions = await getPermissions(ids, { transacting });
  const classesData = withInfo ? await getClassData(permissions, { userSession, transacting }) : {};
  const permissionsByAsset = groupBy(permissions, 'item');
  return ids.map(id => mapPermissionsToRoles(permissionsByAsset[id], classesData));
}

module.exports = { getClassesPermissions };
