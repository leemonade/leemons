const { randomString } = require('@leemons/utils');

async function generateJWTPrivateKey({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'jwt-private-key' }).lean();
  if (!config) {
    const configDoc = await ctx.tx.db.Config.create({
      key: 'jwt-private-key',
      value: randomString(),
    });
    return configDoc.toObject();
  }
  return config;
}

module.exports = { generateJWTPrivateKey };
