const { table } = require('../tables');

async function saveProgram(program, config, { transacting } = {}) {
  await table.config.set(
    { type: 'program', typeId: program },
    {
      type: 'program',
      typeId: program,
      config: JSON.stringify(config),
    },
    { transacting }
  );
  leemons.socket.emitToAll(`COMUNICA:CONFIG:PROGRAM`, { program, config });

  return config;
}

module.exports = { saveProgram };
