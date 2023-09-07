async function setCanEditProfiles({ profiles, ctx }) {
  return ctx.tx.db.Configs.findOneAndUpdate(
    { key: 'can-edit-profiles' },
    { key: 'can-edit-profiles', value: JSON.stringify(profiles) },
    { upsert: true, new: true, lean: true }
  );
}

module.exports = { setCanEditProfiles };
