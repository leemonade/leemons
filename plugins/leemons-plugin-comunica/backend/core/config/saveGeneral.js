const _ = require('lodash');

async function saveGeneral({ config, ctx }) {
  await ctx.tx.db.Config.updateOne(
    { type: 'general' },
    {
      type: 'general',
      config: JSON.stringify(config),
    },
    { upsert: true }
  );
  ctx.socket.emitToAll(`COMUNICA:CONFIG:GENERAL`, config);

  return config;
}

module.exports = { saveGeneral };
