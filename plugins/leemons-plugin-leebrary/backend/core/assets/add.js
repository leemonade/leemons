/* eslint-disable no-param-reassign */
const { map, isEmpty, isNil, isString, isArray, trim, forEach } = require('lodash');

const got = require('got');
const metascraper = require('metascraper');

const { LeemonsError } = require('leemons-error');
const { CATEGORIES, assetRoles } = require('../../config/constants');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');
const { validateAddAsset } = require('../validations/forms');
const { add: addBookmark } = require('../bookmarks/add');
const getAssetPermissionName = require('../permissions/helpers/getAssetPermissionName');

/*
* permissions example
* [
    {
      canEdit: true,
      isCustomPermission: true,
      permissionName: 'plugins.calendar.calendar.idcalendario',
      actionNames: ['view', 'delete', 'admin', 'owner'],
    },
  ]
* */

/**
 * Add a new asset with the specified data.
 *
 * @param {Object} options - Input options.
 * @param {Object} options.data - The data for the asset to be added.
 * @param {Object} options.file - The file to be uploaded as the asset's main file.
 * @param {Object} options.cover - The file to be uploaded as the asset's cover image.
 * @param {Object|string} options.category - The category of the asset. It can be either the category ID or category key.
 * @param {Object[]} options.canAccess - The list of user agents and their roles that have access to the asset.
 * @param {Object} options.options - Additional options for the asset.
 * @param {string} options.options.newId - The new ID for the asset (optional).
 * @param {boolean} options.options.published - Whether the asset is published (default is true).
 * @param {Object[]|Object} options.options.permissions - The permissions for the asset.
 * @param {boolean} options.options.duplicating - Whether the asset is being duplicated (default is false).
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @param {Object} options.ctx.meta - Context metadata for the request.
 * @param {Object} options.ctx.meta.userSession - User session.
 * @returns {Promise<Object>} The newly created asset with additional data.
 * @throws {LeemonsError} If there is an error while adding the asset.
 */

async function add({
  data,
  file,
  cover,
  category,
  canAccess,
  options: { newId, published = true, permissions: _permissions, duplicating = false } = {},
  ctx,
}) {
  const { userSession } = ctx.meta;
  // eslint-disable-next-line no-nested-ternary
  const pPermissions = _permissions
    ? isArray(_permissions)
      ? _permissions
      : [_permissions]
    : _permissions;

  // ES: Asignamos la categoría de "media-files" por defecto.
  // EN: Assign the "media-files" category by default.
  data.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;

  // ES: En caso de que se quiera crear un Bookmark, pero no vengan los datos desde el frontend, los obtenemos.
  // EN: In case you want to create a Bookmark, but not come from the frontend, we get them.
  if (data.categoryKey === CATEGORIES.BOOKMARKS) {
    if (isString(data.url) && !isEmpty(data.url) && (isNil(data.icon) || isEmpty(data.icon))) {
      try {
        const { body: html } = await got(data.url);
        const metas = await metascraper({ html, url: data.url });

        data.name = !isEmpty(data.name) && data.name !== 'null' ? data.name : metas.title;
        data.description = data.description || metas.description;

        if (isEmpty(trim(data.cover))) data.cover = null;

        data.cover = cover ?? metas.image;
        cover = data.cover;

        if (!isEmpty(metas.logo)) {
          data.icon = data.icon || metas.logo;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error getting bookmark metadata:', data.url, err);
      }
    }
  }

  await validateAddAsset(data);

  const { categoryId, categoryKey, tags, subjects, ...assetData } = data;

  if (userSession) {
    assetData.fromUser = userSession.id;
    assetData.fromUserAgent =
      userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  }

  if (isEmpty(category)) {
    if (!isEmpty(categoryId)) {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryById({ id: categoryId, ctx });
    } else {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryByKey({ key: categoryKey, ctx });
    }
  } else if (isString(category)) {
    // Checks if uuid is passed
    if (
      category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryById({ id: category, ctx });
    } else {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryByKey({ key: category, ctx });
    }
  }

  let canUse = [ctx.prefixPN(''), category?.pluginOwner];
  if (isArray(category?.canUse) && category?.canUse.length) {
    canUse = canUse.concat(category.canUse);
  }
  if (category?.canUse !== '*' && !canUse.includes(ctx.callerPlugin)) {
    throw new LeemonsError(ctx, {
      message: `Category "${category.key}" was not created by the plugin "${ctx.callerPlugin}". You can only add assets to categories created by the plugin "${this.calledFrom}".`,
      httpStatusCode: 403,
    });
  }

  // ··········································································
  // UPLOAD FILE

  // EN: Upload the file to the provider
  // ES: Subir el archivo al proveedor

  let newFile;
  let coverFile;

  // Media files
  if (!isEmpty(file)) {
    newFile = await uploadFromSource({ source: file, name: assetData.name, ctx });

    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
    }
  }
  if (!coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource({ source: cover, name: assetData.name, ctx });
  }

  // ··········································································
  // CREATE ASSET

  if (isNil(newId) || isEmpty(newId)) {
    // ES: Añadimos el control de versiones
    // EN: Add version control

    // const { versionControl } = leemons.getPlugin('common').services;
    // const { fullId } = await versionControl.register(leemons.plugin.prefixPN(category.id), {
    //   published,
    //   transacting,
    // });
    const { fullId } = await ctx.tx.call('common.versionControl.register', {
      type: ctx.prefixPN(category.id),
      published,
    });

    // eslint-disable-next-line no-param-reassign
    newId = fullId;
  }

  // Set indexable as TRUE by default
  if (isNil(assetData.indexable)) {
    assetData.indexable = true;
  }

  // EN: Firstly create the asset in the database to get the id
  // ES: Primero creamos el archivo en la base de datos para obtener el id
  const newAsset = await ctx.tx.db.Assets.create({
    ...assetData,
    id: newId,
    category: category.id,
    cover: coverFile?.id,
  });

  if (subjects && subjects.length) {
    await Promise.all(
      map(subjects, (item) => ctx.tx.db.AssetsSubjects.create({ asset: newAsset.id, ...item }))
    );
  }

  // ··········································································
  // ADD PERMISSIONS

  const permissionName = getAssetPermissionName({ assetId: newAsset.id, ctx });

  // ES: Primero, añadimos permisos al archivo
  // EN: First, add permission to the asset
  const permissionsPromises = [
    ctx.tx.call('users.permissions.addItem', {
      item: newAsset.id,
      type: ctx.prefixPN(category.id),
      data: {
        permissionName,
        actionNames: assetRoles,
      },
      isCustomPermission: true,
    }),
  ];

  if (pPermissions && pPermissions.length) {
    forEach(pPermissions, ({ isCustomPermission, canEdit, ...per }) => {
      permissionsPromises.push(
        ctx.tx.call('users.permissions.addItem', {
          item: newAsset.id,
          type: ctx.prefixPN(canEdit ? 'asset.can-edit' : 'asset.can-view'),
          data: per,
          isCustomPermission,
        })
      );
    });
  }
  await Promise.all(permissionsPromises);
  // ES: Luego, añade los permisos a los usuarios
  // EN: Then, add the permissions to the users
  const permissions = [];
  let hasOwner = false;

  if (canAccess && !isEmpty(canAccess)) {
    for (let i = 0, len = canAccess.length; i < len; i++) {
      const { userAgent, role } = canAccess[i];
      hasOwner = hasOwner || role === 'owner';

      permissions.push(
        ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
          userAgentId: userAgent,
          data: {
            permissionName,
            actionNames: [role],
            target: category.id,
          },
        })
      );
    }
  }

  if (!hasOwner) {
    permissions.push(
      ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
        userAgent: map(userSession.userAgents, 'id'),
        data: {
          permissionName,
          actionNames: ['owner'],
          target: category.id,
        },
      })
    );
  }

  await Promise.all(permissions);

  // ··········································································
  // ADD FILES

  const promises = [];

  // EN: Assign the file to the asset
  // ES: Asignar el archivo al asset

  if (isString(newFile?.id)) {
    try {
      await addFiles({ fileId: newFile.id, assetId: newAsset.id, skipPermissions: true, ctx });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  // ··········································································
  // CREATE BOOKMARK

  if (!duplicating && category.key === CATEGORIES.BOOKMARKS) {
    promises.push(
      addBookmark({ url: assetData.url, iconUrl: assetData.icon, asset: newAsset, ctx })
    );
  }

  // ··········································································
  // ADD TAGS

  if (tags?.length > 0) {
    // const tagsService = leemons.getPlugin('common').services.tags;
    promises.push(
      ctx.tx.call('common.tags.setTagsToValues', {
        type: ctx.prefixPN(''),
        tags,
        values: newAsset.id,
      })
    );
  }

  // ··········································································
  // PROCCESS EVERYTHING

  await Promise.all(promises);

  return { ...newAsset, subjects, file: newFile, cover: coverFile, tags };
}

module.exports = { add };
