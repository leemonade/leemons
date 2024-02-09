const { pick } = require('lodash');
const { validateAssignable } = require('../../../validations/validateAssignable');
const { duplicateAsset } = require('../../leebrary/assets/duplicateAsset');
const { registerAssignablePermission } = require('../../permissions/assignables');
const { addPermissionToUser } = require('../../permissions/assignables/users/addPermissionToUser');
const { saveSubjects } = require('../../subjects/saveSubjects');
const { publishAssignable } = require('../publishAssignable');

/**
 * Create an asset
 * @async
 * @function createAsset
 * @param {Object} params - The main parameter object.
 * @param {Object} params.asset - The asset to create.
 * @param {string} params.role - The role of the asset.
 * @param {Array<Object>} params.subjects - The subjects of the asset.
 * @param {boolean} params.published - Flag to publish the asset.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The created asset.
 */
async function createAsset({ asset, role, subjects, published, ctx }) {
  const assetProgram = subjects?.length ? subjects[0].program : null;
  const assetSubjects = subjects?.length ? subjects.map((subject) => subject.subject) : null;

  return ctx.tx.call('leebrary.assets.add', {
    asset: {
      ...pick(asset, ['cover', 'color', 'name', 'tagline', 'description', 'tags', 'indexable']),
      program: assetProgram,
      subjects: assetSubjects,
      category: `assignables.${role}`,
      public: true,
    },
    published,
  });
}

/**
 * Save resources
 * @async
 * @function saveResources
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.resources - The resources to save.
 * @param {Object} params.leebraryResources - The leebrary resources to save.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The saved resources.
 */
async function saveResources({ resources, leebraryResources, ctx }) {
  let duplicatedResources;
  let duplicatedLeebraryResources;

  if (resources?.length) {
    duplicatedResources = await Promise.all(
      resources.map(async (resource) => {
        const id = resource?.id ?? resource;
        const shouldDuplicate = resource?.duplicate ?? true;

        if (!shouldDuplicate) {
          return id;
        }

        return (await duplicateAsset({ id, preserveName: true, public: 1, indexable: 0, ctx })).id;
      })
    );
  }

  if (leebraryResources) {
    const parsedAssets = Object.entries(leebraryResources).map(async ([key, value]) => {
      if (Array.isArray(value)) {
        return [key, (await saveResources({ resources: value, ctx })).resources];
      }

      return [
        key,
        (await duplicateAsset({ id: value, preserveName: true, public: 1, indexable: 0, ctx })).id,
      ];
    });

    duplicatedLeebraryResources = Object.fromEntries(await Promise.all(parsedAssets));
  }

  return {
    resources: duplicatedResources,
    leebraryResources: duplicatedLeebraryResources,
  };
}

/**
 * Register version if no id
 * @async
 * @function registerVersionIfNoId
 * @param {Object} params - The main parameter object.
 * @param {string} params.id - The id to register.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<string>} The registered id.
 */
async function registerVersionIfNoId({ id, ctx }) {
  if (!id) {
    const version = await ctx.tx.call('common.versionControl.register', { type: 'assignable' });

    return version.fullId;
  }

  return id;
}

/**
 * Create an assignable
 * @async
 * @function createAssignable
 * @param {Object} params - The main parameter object.
 * @param {AssignablesAssignable} params.assignable - The assignable to create.
 * @param {boolean} params.published - Flag to publish the assignable.
 * @param {string} params.id - The id of the assignable.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesAssignable>} The created assignable.
 */
async function createAssignable({
  assignable,
  published,
  id,

  ctx,
}) {
  try {
    const {
      asset: assignableAsset,
      metadata,
      resources,
      role,
      subjects,
      ...assignableObject
    } = assignable;

    /*
          Validate entities
        */

    validateAssignable(assignable, { useRequired: true });

    // Throw error if role does not exists
    await ctx.tx.call('assignables.roles.getRole', { role: assignable.role });

    /*
          Compute the ids to save
        */
    const idToUse = await registerVersionIfNoId({ id, ctx });

    // Duplicate assets to avoid permission conflicts
    const { resources: resourcesToSave, leebraryResources } = await saveResources({
      resources,
      leebraryResources: metadata?.leebrary,
      ctx,
    });

    /*
          Create the assignable entity
        */
    const asset = id
      ? assignableAsset
      : (await createAsset({ asset: assignableAsset, role, subjects, published: false, ctx })).id;

    const assignableToCreate = {
      ...assignableObject,
      id: idToUse,
      role,
      asset,
      metadata: leebraryResources
        ? {
            ...metadata,
            leebrary: leebraryResources,
          }
        : metadata,
      resources: resourcesToSave ?? [],
    };

    let assignableCreated = await ctx.tx.db.Assignables.create(assignableToCreate);
    assignableCreated = assignableCreated.toObject();

    await saveSubjects({
      assignableId: assignableCreated.id,
      subjects,
      ctx,
    });

    /*
          Permissions
        */
    await registerAssignablePermission({
      id: assignableCreated.id,
      role: assignableCreated.role,
      ctx,
    });

    await addPermissionToUser({
      id: assignableCreated.id,
      userAgents: ctx.meta.userSession.userAgents.map((user) => user.id),
      role: 'owner',
      ctx,
    });

    if (published) {
      await publishAssignable({ id: assignableCreated.id, ctx });
    }

    return assignableCreated;
  } catch (e) {
    e.message = `Failed to create assignable: ${e.message}`;
    throw e;
  }
}

module.exports = { createAssignable };
