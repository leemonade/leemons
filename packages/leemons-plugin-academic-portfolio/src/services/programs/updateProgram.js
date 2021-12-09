const { table } = require('../tables');
const { programsByIds } = require('./programsByIds');
const { validateUpdateProgram } = require('../../validations/forms');

async function updateProgram(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateUpdateProgram(data);

      const { id, ...programData } = data;

      const program = await table.programs.update({ id }, programData, { transacting });

      return (await programsByIds([program.id], { transacting }))[0];
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { updateProgram };
