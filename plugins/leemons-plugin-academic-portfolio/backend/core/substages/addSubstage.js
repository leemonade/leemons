const { table } = require('../tables');

async function addSubstage(
  { name, abbreviation, number, program, frequency, index },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.groups.create(
        {
          name,
          abbreviation,
          number,
          program,
          frequency,
          index,
          type: 'substage',
        },
        {
          transacting,
        }
      ),
    table.programCenter,
    _transacting
  );
}

module.exports = { addSubstage };
