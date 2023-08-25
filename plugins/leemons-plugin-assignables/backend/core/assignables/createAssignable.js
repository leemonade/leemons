const { pick } = require('lodash');
const { validateAssignable } = require('../../validations/validateAssignable');
const { duplicateAsset } = require('../leebrary/assets/duplicateAsset');
const { registerAssignablePermission } = require('../permissions/assignables');
const { addPermissionToUser } = require('../permissions/users/addPermissionToUser');
const { saveSubjects } = require('../subjects/saveSubjects');

async function createAsset({ asset, role, subjects, published, ctx }) {
  const assetProgram = subjects?.length ? subjects[0].program : null;
  const assetSubjects = subjects?.length
    ? subjects.map(({ subject, level }) => ({ subject, level }))
    : null;

  try {
    const savedAsset = await ctx.tx.call('leebrary.assets.add', {
      asset: {
        ...pick(asset, ['cover', 'color', 'name', 'tagline', 'description', 'tags', 'indexable']),
        program: assetProgram,
        subjects: assetSubjects,
        category: `assignables.${role}`,
        public: true,
      },
      published,
    });

    return savedAsset;
  } catch (e) {
    e.message = `Error creating the asset: ${e.message}`;
    throw e;
  }
}

async function saveResources({ resources, leebraryResources, ctx }) {
  let duplicatedResources;
  let duplicatedLeebraryResources;

  if (resources?.length) {
    duplicatedResources = await Promise.all(
      resources.map(
        async (resource) =>
          (
            await duplicateAsset({ id: resource, preserveName: true, public: 1, indexable: 0, ctx })
          ).id
      )
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

async function registerVersionIfNoId({ id, ctx }) {
  if (!id) {
    const version = await ctx.tx.call('common.versions.register');

    return version.fullId;
  }

  return id;
}

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

    validateAssignable(assignable);
    await ctx.tx.call('assignables.roles.get', { role: assignable.role });

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
      resources: resourcesToSave,
    };

    const assignableCreated = await ctx.tx.db.Assignables.create(assignableToCreate);

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

    return assignableCreated;
  } catch (e) {
    e.messsage = `Failed to create assignable: ${e.message}`;
    throw e;
  }
}

module.exports = { createAssignable };
