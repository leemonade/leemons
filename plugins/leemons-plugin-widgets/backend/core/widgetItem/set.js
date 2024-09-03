const { update, add } = require('.');

async function set({ zoneKey, key, url, name, description, path, profiles, properties = {}, ctx }) {
  const exists = await ctx.tx.db.WidgetItem.countDocuments({ key });
  if (exists) {
    return update({
      zoneKey,
      key,
      url,
      name,
      description,
      profiles,
      properties,
      path,
      ctx,
    });
  }
  return add({
    zoneKey,
    key,
    url,
    name,
    description,
    profiles,
    properties,
    path,
    ctx,
  });
}

module.exports = { set };
