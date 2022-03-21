const { taskObjectives: table } = require('../../table');

module.exports = async function listObjectives({ transacting } = {}) {
  try {
    const list = await table.find(
      { objective_$null: false },
      {
        columns: ['id', 'objective'],
        transacting,
      }
    );

    return list.map(({ objective }) => objective);
  } catch (e) {
    throw new Error(`Failed to list objectives: ${e.message}`);
  }
};
