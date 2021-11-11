const { table } = require('../tables');

async function listClasses(page, size, program, { transacting } = {}) {
  const response = await global.utils.paginate(
    table.groups,
    page,
    size,
    { program, type: 'course' },
    {
      transacting,
    }
  );

  console.log(response);

  return response;
}

module.exports = { listClasses };
