async function saveCenter({ center, config, ctx }) {
  await ctx.tx.db.Config.updateOne(
    { type: 'center', typeId: center },
    {
      type: 'center',
      typeId: center,
      config: JSON.stringify(config),
    },
    { upsert: true }
  );
  ctx.socket.emitToAll(`COMUNICA:CONFIG:CENTER`, { center, config });

  return config;
}

module.exports = { saveCenter };
