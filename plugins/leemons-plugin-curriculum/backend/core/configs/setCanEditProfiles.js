async function setCanEditProfiles({ profiles, ctx }) {
  return ctx.tx.db.Configs.updateOne(
    { key: 'can-edit-profiles' },
    { key: 'can-edit-profiles', value: JSON.stringify(profiles) },
    { upsert: true }
  );
}

module.exports = { setCanEditProfiles };
