const { get } = require('./get');

async function save({ userAgent, config, ctx }) {
  const result = await ctx.tx.db.UserAgentConfig.findOneAndUpdate(
    { userAgent },
    { userAgent, ...config },
    { lean: true, new: true, upsert: true }
  );
  ctx.socket.emit(userAgent, `COMUNICA:CONFIG`, await get({ userAgent, ctx }));
  return result;
}

module.exports = { save };
