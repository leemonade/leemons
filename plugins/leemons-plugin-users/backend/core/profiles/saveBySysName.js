const { update } = require('./update');
const { add } = require('./add');

async function saveBySysName({ sysName, ctx, ...data }) {
  let profile = await ctx.tx.db.Profiles.findOne({
    sysName,
  }).lean();

  if (profile) {
    profile = await update({ id: profile.id, ...data, ctx });
  } else {
    profile = await add({ ...data, sysName, ctx });
  }

  return profile;
}

module.exports = { saveBySysName };
