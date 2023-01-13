/* eslint-disable no-await-in-loop */
const { map, uniq, filter, forEach, isArray } = require('lodash');
const { validateSetPermissions } = require('../../validations/forms');
const { getByIds } = require('../assets/getByIds');
const { getByAsset } = require('./getByAsset');
const canAssignRole = require('./helpers/canAssignRole');
const canUnassignRole = require('./helpers/canUnassignRole');
const validateRole = require('./helpers/validateRole');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const { update: updateAsset } = require('../assets/update');
const { tables } = require('../tables');

async function setAssetPermissionsForClasses(
  { asset, classesCanAccess, assignerRole, target },
  { transacting }
) {
  const classesPermissionNames = classesCanAccess.map(
    ({ class: classId }) => `plugins.academic-portfolio.class.${classId}`
  );

  const { services: userService } = leemons.getPlugin('users');
  const permissions = await userService.permissions.findItems(
    {
      item: asset,
      permissionName_$in: classesPermissionNames,
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );

  const oldRoles = permissions.reduce((obj, permission) => {
    const role = permission.type.includes('can-edit') ? 'editor' : 'viewer';
    return {
      ...obj,
      [permission.permissionName.replace(`plugins.academic-portfolio.class.`, '')]: role,
    };
  }, {});

  // EN: Check if the user can assign all of the new given roles
  // ES: Comprobar si el usuario puede asignar todos los nuevos roles
  classesCanAccess
    .map((klass) => ({
      role: klass.role,
      oldRole: oldRoles[klass.class] ?? undefined,
    }))
    .forEach((klass) => {
      if (!canAssignRole(assignerRole, klass.oldRole, klass.role)) {
        throw new global.utils.HttpError(
          401,
          `You don't have permission to unassign this role: ${klass.role}`
        );
      }
    });

  // EN: Remove existing permissions for classes
  // ES: Eliminar permisos de las clases existentes
  await userService.permissions.removeItems(
    {
      type_$in: [
        leemons.plugin.prefixPN('asset.can-edit'),
        leemons.plugin.prefixPN('asset.can-view'),
      ],
      item: asset,
      permissionName_$in: classesPermissionNames,
    },
    { transacting }
  );

  // EN: Save permissions for the classes
  // ES: Guardar los permisos para las clases
  const editorClasses = classesCanAccess.filter((klass) => klass.role === 'editor');
  const viewerClasses = classesCanAccess.filter((klass) => klass.role === 'viewer');

  await Promise.all([
    userService.permissions.addItem(
      asset,
      leemons.plugin.prefixPN(`asset.can-edit`),
      editorClasses.map((klass) => ({
        actionNames: ['view'],
        target,
        permissionName: `plugins.academic-portfolio.class.${klass.class}`,
      })),
      { transacting, isCustomPermission: true }
    ),
    userService.permissions.addItem(
      asset,
      leemons.plugin.prefixPN(`asset.can-view`),
      viewerClasses.map((klass) => ({
        actionNames: ['view'],
        target,
        permissionName: `plugins.academic-portfolio.class.${klass.class}`,
      })),
      { transacting, isCustomPermission: true }
    ),
  ]);
}

async function removeMissingClassesPermissions(
  { asset, classesCanAccess, assignerRole },
  { transacting }
) {
  const { services: userService } = leemons.getPlugin('users');
  const classesPermissionNames = classesCanAccess.map(
    ({ class: classId }) => `plugins.academic-portfolio.class.${classId}`
  );

  // EN: Get all the classes that were assigned
  // ES: Obtener todas las clases que estaban asignadas
  const permissions = await userService.permissions.findItems(
    {
      item: asset,
      permissionName_$nin: classesPermissionNames,
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );

  // EN: Check that all the classes can be unassigned
  // ES: Comprobar que todas las clases se pueden desasignar
  const roles = uniq(
    permissions.map((permission) =>
      permission.type === leemons.plugin.prefixPN('asset.can-edit') ? 'editor' : 'viewer'
    )
  );
  roles.forEach((role) => {
    if (!canUnassignRole(assignerRole, role)) {
      throw new global.utils.HttpError(
        401,
        `You don't have permission to unassign this role: ${role}`
      );
    }
  });

  // EN: Remove the old classes
  // ES: Eliminar las clases antiguas
  await userService.permissions.removeItems(
    {
      item: asset,
      permissionName_$nin: classesPermissionNames,
      permissionName_$startsWith: 'plugins.academic-portfolio.class.',
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );
}

/**
 * Set userAgents permissions / roles in order to access to the specified assetID
 * @public
 * @static
 * @param {string} assetId - Asset ID
 * @param {any=} isPublic, canAccess - Array of { userAgent: string, role: string }
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string[]>}
 * */
async function set(
  assetId,
  { isPublic, programsCanAccess, classesCanAccess, canAccess },
  { deleteMissing, userSession, transacting } = {}
) {
  try {
    await validateSetPermissions({ asset: assetId, canAccess, isPublic });

    // ES: Si no es publico comprobamos si los roles que se quieren usar existen
    if (!isPublic) {
      const roles = [];
      if (canAccess.length) {
        roles.push(...canAccess.map(({ role }) => role));
      }
      if (classesCanAccess.length) {
        roles.push(...classesCanAccess.map(({ role }) => role));
      }
      roles.forEach((role) => {
        if (!validateRole(role)) {
          throw new global.utils.HttpError(412, `Invalid role: ${role}}`);
        }
      });
    }

    // EN: Get the assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { role: assignerRole } = await getByAsset(assetId, { userSession, transacting });

    const [assetData] = await getByIds([assetId], { userSession });

    if (assignerRole !== 'owner' && (isPublic || assetData.public)) {
      throw new global.utils.HttpError(412, 'Only owner can set public permissions');
    }

    if (isPublic || assetData.public) {
      await updateAsset({ ...assetData, public: isPublic }, { userSession, transacting });
    }

    const categoryId = assetData?.category;
    const permissionName = getAssetPermissionName(assetId);
    const { services: userService } = leemons.getPlugin('users');
    const result = [];

    for (let i = 0, len = canAccess?.length || 0; i < len; i++) {
      const { userAgent, role } = canAccess[i];

      // Skip iteration if user is whos calls
      if (map(userSession.userAgents, 'id').includes(userAgent)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const { role: assigneeRole } = await getByAsset(assetId, {
        userSession: {
          userAgents: [{ id: userAgent }],
        },
        transacting,
      });

      // EN: Check if assigner can assign role to assignee
      // ES: Comprobar si el asignador puede asignar el rol al asignado
      if (!canAssignRole(assignerRole, assigneeRole, role)) {
        throw new global.utils.HttpError(401, "You don't have permission to assign this role");
      }

      // EN: When assigning owner role, replace current owner role by editor role
      // ES: Cuando se asigna el rol de propietario, reemplazar el rol de propietario actual por el rol de editor
      if (role === 'owner' && assignerRole === 'owner') {
        // First, remove all permissions to the asset
        await userService.permissions.removeCustomUserAgentPermission(
          map(userSession.userAgents, 'id'),
          {
            permissionName,
          },
          { transacting }
        );

        // Then, add editor permission to the asset
        result.push(
          await userService.permissions.addCustomPermissionToUserAgent(
            map(userSession.userAgents, 'id'),
            {
              permissionName,
              actionNames: ['editor'],
              target: categoryId,
            },
            { transacting }
          )
        );
      }

      // First, remove all permissions to the asset
      await userService.permissions.removeCustomUserAgentPermission(
        userAgent,
        {
          permissionName,
        },
        { transacting }
      );

      try {
        // EN: Set role
        // ES: Asignar rol
        result.push(
          await userService.permissions.addCustomPermissionToUserAgent(
            userAgent,
            {
              permissionName,
              actionNames: [role],
              target: categoryId,
            },
            { transacting }
          )
        );
      } catch (e) {
        leemons.log.info(
          `Cannot assign custom permissions to UserAgent ${userAgent}: ${e.message}`
        );
      }
    }

    if (isArray(programsCanAccess)) {
      const currentPermissions = await userService.permissions.getItemPermissions(
        assetData.id,
        leemons.plugin.prefixPN('asset.can-view'),
        { transacting }
      );
      const currentPermissionNames = map(currentPermissions, 'permissionName');

      const toDelete = [];
      const toNothing = [];
      const toAdd = [];

      forEach(programsCanAccess, (program) => {
        const perm = `plugins.academic-portfolio.program.inside.${program}`;
        if (currentPermissionNames.includes(perm)) {
          toNothing.push(perm);
        } else {
          toAdd.push(perm);
        }
      });

      forEach(currentPermissionNames, (programPermission) => {
        if (
          programPermission.startsWith('plugins.academic-portfolio.program.inside.') &&
          !toNothing.includes(programPermission)
        ) {
          toDelete.push(programPermission);
        }
      });

      if (toDelete.length) {
        await userService.permissions.removeItems(
          {
            item: assetData.id,
            type: leemons.plugin.prefixPN('asset.can-view'),
            permissionName_$in: toDelete,
          },
          { transacting }
        );
      }

      if (toAdd.length) {
        await Promise.all(
          map(toAdd, (pName) =>
            userService.permissions.addItem(
              assetData.id,
              leemons.plugin.prefixPN('asset.can-view'),
              {
                permissionName: pName,
                actionNames: ['view'],
              },
              { isCustomPermission: true, transacting }
            )
          )
        );
      }
    }

    if (classesCanAccess?.length) {
      const classesIds = map(classesCanAccess, 'class');
      const classes = await leemons
        .getPlugin('academic-portfolio')
        .services.classes.classByIds(classesIds);
      const classesSubjectIds = uniq(map(classes, 'subject.id'));
      const alreadySubjectIds = map(assetData.subjects, 'subject');
      const toAddSubjectIds = filter(
        classesSubjectIds,
        (subjectId) => !alreadySubjectIds.includes(subjectId)
      );

      if (toAddSubjectIds && toAddSubjectIds.length) {
        await Promise.all(
          map(toAddSubjectIds, (item) =>
            tables.assetsSubjects.create({ asset: assetData.id, subject: item }, { transacting })
          )
        );
      }

      await setAssetPermissionsForClasses(
        { asset: assetId, classesCanAccess, assignerRole, target: categoryId },
        { userSession, transacting }
      );
    }

    if (deleteMissing) {
      await removeMissingClassesPermissions(
        { asset: assetId, classesCanAccess, assignerRole },
        { transacting }
      );

      const toUpdate = map(canAccess, 'userAgent');
      let toRemove = await userService.permissions.findUserAgentsWithPermission({
        permissionName,
      });
      toRemove = toRemove.filter((ua) => !toUpdate.includes(ua));

      for (let i = 0, len = toRemove.length; i < len; i++) {
        const userAgent = toRemove[i];

        // Skip iteration if user is whos calls
        if (map(userSession.userAgents, 'id').includes(userAgent)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const { role: assigneeRole } = await getByAsset(assetId, {
          userSession: {
            userAgents: [{ id: userAgent }],
          },
          transacting,
        });

        if (assignerRole !== 'owner' && assigneeRole !== 'owner') {
          // EN: Check if assigner can assign role to assignee
          // ES: Comprobar si el asignador puede asignar el rol al asignado
          if (!canUnassignRole(assignerRole, assigneeRole)) {
            throw new global.utils.HttpError(
              401,
              "You don't have permission to unassign this role"
            );
          }

          // Remove all permissions to the asset
          await userService.permissions.removeCustomUserAgentPermission(
            userAgent,
            {
              permissionName,
            },
            { transacting }
          );
        }
      }
    }

    return result;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to set permissions: ${e.message}`);
  }
}

module.exports = { set };
