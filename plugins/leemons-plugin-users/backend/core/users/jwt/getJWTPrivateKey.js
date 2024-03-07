const { generateJWTPrivateKey } = require('./generateJWTPrivateKey');

async function getJWTPrivateKey({ ctx }) {
  let jwtPrivateKey = await ctx.tx.db.Config.findOne({ key: 'jwt-private-key' }).lean();
  if (!jwtPrivateKey) jwtPrivateKey = await generateJWTPrivateKey({ ctx });
  return jwtPrivateKey.value;
}

module.exports = { getJWTPrivateKey };
