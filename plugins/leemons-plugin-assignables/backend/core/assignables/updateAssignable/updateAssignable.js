const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

const {
  validateAssignable,
  validAssignableProperties,
} = require('../../helpers/validators/assignable');
const { getDiff } = require('../../helpers/getDiff');

const { updateAsset } = require('../../leebrary/assets');
const { updateSubjects } = require('../../subjects');
const { addUserToAssignable } = require('../addUserToAssignable');
const { createAssignable } = require('../createAssignable');
const { getAssignable } = require('../getAssignable');
const { listAssignableUserAgents } = require('../listAssignableUserAgents');
const { getUserPermission } = require('../../permissions/assignables/users/getUserPermission');
const { publishAssignable } = require('../publishAssignable');
const { duplicateAsset } = require('../../leebrary/assets');
const { removeAsset } = require('../../leebrary/assets');

const updatableFields = [
  'asset',
  // role,
  'gradable',
  'center',
  'subjects',
  // 'methodology',
  'statement',
  'development',
  'resources',
  'duration',
  'submission',
  'instructionsForTeachers',
  'instructionsForStudents',
  'metadata',
];

/**
 * Update an assignable
 * @async
 * @function updateAssignable
 * @param {Object} params - The main parameter object.
 * @param {AssignablesAssignable} params.assignable - The assignable to update.
 * @param {boolean} params.published - Flag to publish the assignable.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesAssignable>} The updated assignable.
 */

async function updateAssignable({ assignable, published = false, ctx }) {
  try {
    const { id, file, ...assignableObjectReceived } = assignable;

    const assignableObject = _.pick(assignableObjectReceived, updatableFields);

    let shouldUpgrade = false;

    if (_.isEmpty(assignableObject)) {
      throw new Error('No changes detected');
    }

    validateAssignable(assignableObject);

    // EN: Get the current values
    // ES: Obtenemos los valores actuales
    const currentAssignable = await getAssignable({ id, ctx });

    if (currentAssignable.deleted) {
      throw new Error('The assignable is deleted');
    }

    // EN: Check if the user has permission to update the assignable.
    // ES: Comprueba si el usuario tiene permiso para actualizar el asignable.
    const { actions } = await getUserPermission({
      assignableId: currentAssignable.id,
      ctx,
    });

    if (!actions.includes('edit')) {
      throw new Error('You do not have permissions');
    }

    // EN: Diff the current values with the new ones
    // ES: Compara los valores actuales con los nuevos
    const { object, diff } = getDiff(assignableObject, currentAssignable);

    if (!diff.length) {
      throw new Error('No changes detected');
    }

    // EN: Check if the current version is published.
    // ES: Comprueba si la versión actual está publicada.
    const currentVersion = await ctx.tx.call('common.versionControl.getVersion', {
      id,
    });

    if (currentVersion.published) {
      shouldUpgrade = true;
    }

    let assetId = currentAssignable.asset.id;
    const asset = await updateAsset({
      asset: {
        ..._.defaults(object.asset, currentAssignable.asset),
        file: file?.id || file,
        id: currentAssignable.asset.id,
        public: true,
        subjects: object.subjects?.length ? object.subjects : null,
      },
      upgrade: true,
      published: false,
      scale: 'major',
      ctx,
    });

    assetId = asset.id;

    // EN: Update the version.
    // ES: Actualiza la versión.
    if (shouldUpgrade) {
      // TODO: Let the user decide which upgrade scale to use.
      const { fullId } = await ctx.tx.call('common.versionControl.upgradeVersion', {
        id,
        upgrade: 'major',
      });

      // TODO: Duplicate everything and apply changes
      // TODO: Ensure to keep original owner
      const newAssignable = await createAssignable({
        assignable: {
          ..._.pick(object, validAssignableProperties),
          asset: assetId,
        },
        id: fullId,
        ctx,
      });

      // EN: Get the users that have access to the assignable.
      // ES: Obtiene los usuarios que tienen acceso al asignable.
      const users = await listAssignableUserAgents({ assignableId: id, ctx });

      const userAgents = ctx.meta.userSession.userAgents.map((u) => u.id);

      // EN: Add the permissions to the users.
      // ES: Añade los permisos a los usuarios.
      await Promise.all(
        users
          .filter((user) => !userAgents.includes(user.userAgent) && user.role !== 'student')
          .map((user) =>
            addUserToAssignable({
              assignableId: fullId,
              userAgents: user.userAgent,
              role: user.role,
              ctx,
            })
          )
      );
      if (published) {
        await publishAssignable({ id: fullId, ctx });
      }

      return {
        ...newAssignable,
        published,
      };
    }
    // EN: Update the assignable.
    // ES: Actualizar el asignable.

    if (diff.includes('subjects')) {
      const subjects = await updateSubjects({
        assignable: id,
        subjects: object.subjects,
        ctx,
      });
      object.subjects = subjects;
    }

    if (!_.difference(diff, ['subjects']).length) {
      return { id, ...object };
    }

    const updateObject = {
      ..._.omit(_.pick(assignableObject, diff), ['subjects']),
      asset: assetId,
    };

    if (diff.includes('submission')) {
      updateObject.submission = assignableObject.submission;
    }

    if (diff.includes('resources')) {
      const resourcesToSave = [];
      const newResources = _.difference(assignableObject.resources, currentAssignable.resources);
      const resourcesToDelete = _.difference(
        currentAssignable.resources,
        assignableObject.resources
      );
      const resourcesToKeep = _.intersection(
        currentAssignable.resources,
        assignableObject.resources
      );

      resourcesToSave.push(...resourcesToKeep);

      const promises = [];

      if (newResources.length) {
        promises.push(
          ...newResources.map(async (resource) => {
            const duplicatedAsset = await duplicateAsset({
              id: resource,
              preserveName: true,
              public: 1,
              indexable: 0,
              ctx,
            });

            resourcesToSave.push(duplicatedAsset.id);
          })
        );
      }

      if (resourcesToDelete.length) {
        promises.push(
          ...resourcesToDelete.map((resource) =>
            removeAsset({
              id: resource,
              ctx,
            })
          )
        );
      }

      await Promise.all(promises);

      object.resources = resourcesToSave;
      updateObject.resources = resourcesToSave;
    }
    if (diff.includes('metadata')) {
      if (updateObject.metadata?.leebrary) {
        const updateAssets = Object.entries(updateObject.metadata.leebrary).map(
          async ([key, value]) => {
            if (Array.isArray(value)) {
              const resourcesToSave = [];
              const newResources = _.difference(value, currentAssignable.metadata?.leebrary?.[key]);
              const resourcesToDelete = _.difference(
                currentAssignable.metadata?.leebrary?.[key],
                value
              );
              const resourcesToKeep = _.intersection(
                currentAssignable.metadata?.leebrary?.[key],
                value
              );

              resourcesToSave.push(...resourcesToKeep);

              const promises = [];

              if (newResources.length) {
                promises.push(
                  ...newResources.map(async (resource) => {
                    const duplicatedAsset = await duplicateAsset({
                      id: resource,
                      preserveName: true,
                      public: 1,
                      indexable: 0,
                      ctx,
                    });

                    resourcesToSave.push(duplicatedAsset.id);
                  })
                );
              }

              if (resourcesToDelete.length) {
                promises.push(
                  ...resourcesToDelete.map((resource) => removeAsset({ id: resource, ctx }))
                );
              }

              await Promise.all(promises);

              _.set(updateObject, `metadata.leebrary.${key}`, resourcesToSave);
            } else {
              const shouldSave = value.id !== currentAssignable.metadata?.leebrary?.[key];
              const shouldRemove =
                currentAssignable.metadata?.leebrary?.[key] &&
                value.id !== currentAssignable.metadata?.leebrary?.[key];

              if (shouldRemove) {
                await removeAsset({
                  id: currentAssignable.metadata?.leebrary?.[key],
                  ctx,
                });

                _.set(updateObject, `metadata.leebrary.${key}`, null);
              }

              if (shouldSave) {
                const duplicatedAsset = await duplicateAsset({
                  id: value,
                  preserveName: true,
                  public: 1,
                  indexable: 0,
                  ctx,
                });
                _.set(updateObject, `metadata.leebrary.${key}`, duplicatedAsset.id);
              }
            }
          }
        );

        await Promise.all(updateAssets);
        updateObject.metadata = assignableObject.metadata;
      }

      updateObject.metadata = assignableObject.metadata;
    }

    await ctx.tx.db.Assignables.updateOne({ id }, updateObject);

    if (published) {
      await publishAssignable({ id, ctx });
    }

    return {
      id,
      ...object,
      asset: {
        ...object.asset,
        id: assetId,
      },
      published,
    };
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to update assignable: ${e.message}`,
    });
  }
}

module.exports = { updateAssignable };
