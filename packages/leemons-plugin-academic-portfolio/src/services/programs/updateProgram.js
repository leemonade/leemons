const { table } = require('../tables');
const { programsByIds } = require('./programsByIds');
const { validateUpdateProgram } = require('../../validations/forms');

async function updateProgram(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateUpdateProgram(data);

      const { id, ...programData } = data;

      const program = await table.programs.update({ id }, programData, { transacting });

      const _program = (await programsByIds([program.id], { transacting }))[0];
      await leemons.events.emit('after-update-program', { program: _program, transacting });
      return _program;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { updateProgram };
