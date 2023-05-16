const { table } = require('../tables');

async function setPreferences(user, values, { transacting } = {}) {
  return table.userPreferences.set(
    { user },
    {
      user,
      ...values,
    },
    { transacting }
  );
}

module.exports = { setPreferences };
