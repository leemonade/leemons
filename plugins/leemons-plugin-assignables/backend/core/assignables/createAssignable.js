const { pick } = require('lodash');
const { validateAssignable } = require('../../validations/validateAssignable');
const { duplicateAsset } = require('../leebrary/assets/duplicateAsset');

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

async function createAssignable({
  assignable,
  published,
  id,

  ctx,
}) {
  let idToUse = id;

  // EN: Verify the assignable object and throw if not valid
  // ES: Verifica el objeto assignable y lanza un error si no es válido
  validateAssignable(assignable);

  const {
    asset: assignableAsset,
    metadata,
    resources,
    role,
    subjects,
    ...assignableObject
  } = assignable;

  // EN: Check if the role exists
  // ES: Comprobar si existe el rol
  await ctx.tx.call('assignables.roles.get', { role: assignable.role });

  // EN: Register a new versioned entity.
  // ES: Registra una nueva versión de una entidad.
  if (!id) {
    const version = await ctx.tx.call('common.versions.register');

    idToUse = version.fullId;
  }

  // EN: Create the asset
  // ES: Crea el asset
  const asset = !id
    ? (await createAsset({ asset: assignableAsset, role, subjects, published: false, ctx })).id
    : assignableAsset;

  // EN: Create the resources
  // ES: Crea los recursos
  const { resources: resourcesToSave, leebraryResources } = await saveResources({
    resources,
    leebraryResources: metadata?.leebrary,
    ctx,
  });

  // EN: Create the assignable for the given version.
  // ES: Crea el asignable para la versión dada.
  await ctx.tx.db.Assignables.create({
    ...assignableObject,
    id: idToUse,
    asset,
    metadata: leebraryResources
      ? {
          ...metadata,
          leebrary: leebraryResources,
        }
      : metadata,
    resources: resourcesToSave,
  });

  return {
    resourcesToSave,
    leebraryResources,
  };
}

module.exports = { createAssignable };
