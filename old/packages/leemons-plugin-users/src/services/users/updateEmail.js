const { table } = require('../tables');

async function updateEmail(id, email, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const user = await table.users.findOne({ id_$ne: id, email }, { transacting });

      if (user) {
        throw new Error('Email already exists');
      }

      return table.users.update({ id }, { email }, { transacting });
    },
    table.users,
    _transacting
  );
}

module.exports = { updateEmail };
