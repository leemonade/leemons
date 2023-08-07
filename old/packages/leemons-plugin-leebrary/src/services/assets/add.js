/* eslint-disable no-param-reassign */
const { map, isEmpty, isNil, isString, isArray, trim, forEach } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { tables } = require('../tables');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');
const { validateAddAsset } = require('../../validations/forms');
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
async function add(
  { file, cover, category, canAccess, ...data },
  {
    newId,
    published = true,
    userSession,
    permissions: _permissions,
    transacting: t,
    duplicating = false,
  } = {}
) {
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
        const { body: html } = await global.utils.got(data.url);
        const metas = await global.utils.metascraper({ html, url: data.url });
        data.name = !isEmpty(data.name) && data.name !== 'null' ? data.name : metas.title;
        data.description = data.description || metas.description;

        if (isEmpty(trim(data.cover))) data.cover = null;

        data.cover = cover ?? metas.image;
        cover = data.cover;

        if (!isEmpty(metas.logo)) {
          data.icon = data.icon || metas.logo;
        }
      } catch (err) {
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
      category = await getCategoryById(categoryId);
    } else {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryByKey(categoryKey);
    }
  } else if (isString(category)) {
    // Checks if uuid is passed
    if (
      category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryById(category);
    } else {
      // eslint-disable-next-line no-param-reassign
      category = await getCategoryByKey(category);
    }
  }

  let canUse = [leemons.plugin.prefixPN(''), category?.pluginOwner];
  if (isArray(category?.canUse) && category?.canUse.length) {
    canUse = canUse.concat(category.canUse);
  }

  if (category?.canUse !== '*' && !canUse.includes(this.calledFrom)) {
    throw new global.utils.HttpError(
      403,
      `Category "${category.key}" was not created by the plugin "${this.calledFrom}". You can only add assets to categories created by the plugin "${this.calledFrom}".`
    );
  }

  // ··········································································
  // UPLOAD FILE

  // EN: Upload the file to the provider
  // ES: Subir el archivo al proveedor

  let newFile;
  let coverFile;

  // Media files
  if (!isEmpty(file)) {
    newFile = await uploadFromSource(file, { name: assetData.name }, { transacting: t });

    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
    }
  }

  if (!coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource(cover, { name: assetData.name }, { transacting: t });
  }

  return global.utils.withTransaction(
    async (transacting) => {
      // ··········································································
      // CREATE ASSET

      if (isNil(newId) || isEmpty(newId)) {
        // ES: Añadimos el control de versiones
        // EN: Add version control
        const { versionControl } = leemons.getPlugin('common').services;
        const { fullId } = await versionControl.register(leemons.plugin.prefixPN(category.id), {
          published,
          transacting,
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
      const newAsset = await tables.assets.create(
        { ...assetData, id: newId, category: category.id, cover: coverFile?.id },
        { transacting }
      );

      if (subjects && subjects.length) {
        await Promise.all(
          map(subjects, (item) =>
            tables.assetsSubjects.create({ asset: newAsset.id, ...item }, { transacting })
          )
        );
      }

      // ··········································································
      // ADD PERMISSIONS

      const { services: userService } = leemons.getPlugin('users');
      const permissionName = getAssetPermissionName(newAsset.id);

      // ES: Primero, añadimos permisos al archivo
      // EN: First, add permission to the asset
      const permissionsPromises = [
        userService.permissions.addItem(
          newAsset.id,
          leemons.plugin.prefixPN(category.id),
          {
            permissionName,
            actionNames: leemons.plugin.config.constants.assetRoles,
          },
          { isCustomPermission: true, transacting }
        ),
      ];

      if (pPermissions && pPermissions.length) {
        forEach(pPermissions, ({ isCustomPermission, canEdit, canView, canAssign, ...per }) => {
          let permission = 'can-view';
          if (canEdit) {
            permission = 'can-edit';
          } else if (canAssign) {
            permission = 'can-assign';
          }
          permissionsPromises.push(
            userService.permissions.addItem(
              newAsset.id,
              leemons.plugin.prefixPN(`asset.${permission}`),
              per,
              { isCustomPermission, transacting }
            )
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
            userService.permissions.addCustomPermissionToUserAgent(
              userAgent,
              {
                permissionName,
                actionNames: [role],
                target: category.id,
              },
              { transacting }
            )
          );
        }
      }

      if (!hasOwner) {
        permissions.push(
          userService.permissions.addCustomPermissionToUserAgent(
            map(userSession.userAgents, 'id'),
            {
              permissionName,
              actionNames: ['owner'],
              target: category.id,
            },
            { transacting }
          )
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
          await addFiles(newFile.id, newAsset.id, {
            skipPermissions: true,
            userSession,
            transacting,
          });
        } catch (error) {
          console.error(error);
        }
      }

      // ··········································································
      // CREATE BOOKMARK

      if (!duplicating && category.key === CATEGORIES.BOOKMARKS) {
        promises.push(
          addBookmark({ url: assetData.url, iconUrl: assetData.icon }, newAsset, {
            transacting,
          })
        );
      }

      // ··········································································
      // ADD TAGS

      if (tags?.length > 0) {
        const tagsService = leemons.getPlugin('common').services.tags;
        promises.push(
          tagsService.setTagsToValues(leemons.plugin.prefixPN(''), tags, newAsset.id, {
            transacting,
          })
        );
      }

      // ··········································································
      // PROCCESS EVERYTHING

      await Promise.all(promises);

      return { ...newAsset, subjects, file: newFile, cover: coverFile, tags };
    },
    tables.assets,
    t
  );
}

module.exports = { add };
