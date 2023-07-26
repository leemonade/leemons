const { update, add } = require('.');

async function set({ zoneKey, key, url, name, description, profiles, properties = {}, ctx }) {
  const exists = await ctx.tx.db.WidgetItem.count({ key });
  if (exists) {
    return update({
      zoneKey,
      key,
      url,
      name,
      description,
      profiles,
      properties,
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
    ctx,
  });
}

module.exports = { set };
