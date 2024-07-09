async function updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset({
  locationName,
  pluginName,
  ctx,
}) {
  if (pluginName === 'users') {
    if (locationName === 'user-data') {
      return ctx.tx.db.UserAgent.updateMany({ id: { $ne: null } }, { datasetIsGood: false });
    }
    // Example locationName: profile.lrn:local:users:local:6651f240c62b6014e69f78ae:Profiles:6651f24a0e1ea5ea378b8636
    if (locationName.startsWith('profile.')) {
      const profileId = locationName.split('profile.')[1];
      const profileRoles = await ctx.tx.db.ProfileRole.find({ profile: profileId })
        .select(['id', 'role'])
        .lean();
      const filter = { role: { $in: profileRoles.map((r) => r.role) } };
      return ctx.tx.db.UserAgent.updateMany(filter, { datasetIsGood: false });
    }
  }
  return null;
}

module.exports = { updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset };
