const ACTIVITY_TYPE = 'activity';
const ASSET_TYPE = 'asset';
const ASSET_ROLE = 'leebrary.asset';

async function createAssetsAssignables({ module, ctx }) {
  const activities = module.submission.activities.filter(({ type }) => type === ASSET_TYPE);

  const createdAssignablesByAsset = new Map();

  return Object.fromEntries(
    await Promise.all(
      activities.map(async ({ activity: asset, id }) => {
        if (createdAssignablesByAsset.has(asset)) {
          return [id, createdAssignablesByAsset.get(asset)];
        }

        const assignable = {
          role: ASSET_ROLE,
          asset,

          gradable: false,
          subjects: [],
          metadata: {
            leebrary: {
              asset,
            },
          },
        };

        const createdAssignable = await ctx.tx.call('leebrary.assignables.create', { assignable });

        createdAssignablesByAsset.set(asset, createdAssignable.id);

        return [id, createdAssignable.id];
      })
    )
  );
}

module.exports = {
  createAssetsAssignables,

  ACTIVITY_TYPE,
  ASSET_TYPE,
  ASSET_ROLE,
};
