const { table } = require('../tables');

async function addSubstage({ name, abbreviation, program }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const substage = await table.groups.create(
        {
          name,
          abbreviation,
          type: 'substage',
        },
        {
          transacting,
        }
      );
      await table.programSubstage.create(
        { program, substage: substage.id },
        {
          transacting,
        }
      );
      return substage;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { addSubstage };
