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
  return config;
}

module.exports = { saveProgram };
