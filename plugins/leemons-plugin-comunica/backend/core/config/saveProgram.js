async function saveProgram({ program, config, ctx }) {
  await ctx.tx.db.Config.updateOne(
    { type: 'program', typeId: program },
    {
      type: 'program',
      typeId: program,
      config: JSON.stringify(config),
    },
    { upsert: true }
  );
  ctx.socket.emitToAll(`COMUNICA:CONFIG:PROGRAM`, { program, config });

  return config;
}

module.exports = { saveProgram };
