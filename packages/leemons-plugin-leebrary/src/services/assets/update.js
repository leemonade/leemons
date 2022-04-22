const { defaults, cloneDeep, isEqual, differenceWith, isEmpty, pick } = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { tables } = require('../tables');
const { validateAddAsset } = require('../../validations/forms');
const { getByIds } = require('./getByIds');
const { duplicate } = require('./duplicate');
const { CATEGORIES } = require('../../../config/constants');
const { getById: getCategory } = require('../categories/getById');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');

// -----------------------------------------------------------------------------
// HELPERS

function getDiff(a, b) {
  const _a = defaults(cloneDeep(a), b);

  if (isEqual(_a, b)) {
    return { object: _a, diff: [] };
  }

  return {
    object: _a,
    diff: differenceWith(Object.entries(_a), Object.entries(b), isEqual).map(([key]) => key),
  };
}

// -----------------------------------------------------------------------------
// MAIN FUNCTION

async function update(
  data,
  { upgrade, scale = 'major', published = true, userSession, transacting } = {}
) {
  if (isEmpty(data)) {
    throw new Error('No changes detected');
  }

  const { id, ...assetData } = data;
  let assetId = id;
  await validateAddAsset(assetData);

  // EN: Get user's permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.edit) {
    throw new global.utils.HttpError(401, "You don't have permissions to update this asset");
  }

  // EN: Get the current values
  // ES: Obtenemos los valores actuales
  const currentAsset = (await getByIds(assetId, { withFiles: true, transacting }))[0];

  if (!currentAsset) {
    throw new global.utils.HttpError(422, 'Asset not found');
  }

  const compareProps = [
    'name',
    'tagline',
    'description',
    'color',
    'file',
    'cover',
    'public',
    'indexable',
    'tags',
  ];

  const category = await getCategory(currentAsset.category, { transacting });
  if (category.key === CATEGORIES.BOOKMARKS) {
    compareProps.push('url');
  }

  const currentData = pick(currentAsset, compareProps);
  currentData.file = currentAsset.file?.id || null;
  currentData.cover = currentAsset.cover?.id || null;

  const newData = pick(assetData, compareProps);
  newData.file = assetData.file || null;
  newData.cover = assetData.cover || assetData.coverFile || null;

  console.log('-- VAMOS A ACTUALIZAR --');
  console.log('-- currentData:');
  console.dir(currentData, { depth: null });

  console.log('-- newData:');
  console.dir(newData, { depth: 1 });

  // EN: Diff the current values with the new ones
  // ES: Compara los valores actuales con los nuevos
  const { object: updateObject, diff } = getDiff(newData, currentData);

  if (!diff.length) {
    throw new Error('No changes detected');
  }

  console.log('-- DIFF / UPDATE --');
  console.dir(diff, { depth: null });
  console.dir(updateObject, { depth: 1 });

  // ·········································································
  // DUPLICATE ASSET

  const { versionControl } = leemons.getPlugin('common').services;

  // EN: Check if the current version is published.
  // ES: Comprueba si la versión actual está publicada.
  const currentVersion = await versionControl.getVersion(assetId, { transacting });

  // ES: Si la versión actual es la publicada, hacemos el upgrade
  // EN: If the current version is the published one, we upgrade
  if (upgrade && currentVersion.published) {
    const { fullId } = await versionControl.upgradeVersion(assetId, scale, {
      published,
      transacting,
    });

    const duplicatedAsset = await duplicate(assetId, { newId: fullId, transacting });
    assetId = duplicatedAsset.id;
  }

  // ·········································································
  // CHECKING TAGS

  if (diff.includes('tags')) {
    console.log('-- HAN CAMBIADO LOS TAGS --');
    const tagsService = leemons.getPlugin('common').services.tags;
    const tagsType = leemons.plugin.prefixPN('');

    await tagsService.removeAllTagsForValues(tagsType, assetId, { transacting });
    await tagsService.setTagsToValues(tagsType, updateObject.tags, assetId, {
      transacting,
    });

    console.log('-- Tags actualizados !');
  }

  // ·········································································
  // CHECKING FILES

  const { file } = assetData;
  const cover = assetData.cover || assetData.coverFile;
  let newFile;
  let coverFile;

  if (diff.includes('file') && !isEmpty(file)) {
    console.log('-- HA CAMBIADO EL ARCHIVO --');
    newFile = await uploadFromSource(file, { name: assetData.name }, { transacting });

    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
    }

    await addFiles(newFile.id, assetId, { userSession, transacting });
    delete updateObject.file;
    console.log('-- Archivo actualizado !');
  }

  if (diff.includes('cover') && !coverFile && !isEmpty(cover)) {
    console.log('-- HA CAMBIADO EL COVER --');
    coverFile = await uploadFromSource(cover, { name: assetData.name }, { transacting });
  }

  if (coverFile?.id) {
    console.log('-- Cover Actualizado !');
    updateObject.cover = coverFile.id;
  }

  // ES: En caso de que no hayan cambio en los archivos, los dejamos establecidos con su valor actual
  // EN: If there are no changes in the files, we keep the current values
  if (!newFile && !diff.includes('file')) {
    newFile = currentAsset.file;
  }

  if (!coverFile && !diff.includes('cover')) {
    coverFile = currentAsset.cover;
  }

  // ·········································································
  // UPDATE ASSET DATA

  // EN: Update the asset
  // ES: Actualizar el asset
  const asset = await tables.assets.update({ id: assetId }, updateObject, { transacting });
  console.log('-- Asset actualizado !');

  return { ...asset, file: newFile, cover: coverFile, tags: newData.tags };
}

module.exports = { update };
