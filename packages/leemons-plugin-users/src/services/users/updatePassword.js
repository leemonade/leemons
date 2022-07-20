const { table } = require('../tables');
const { encryptPassword } = require('./bcrypt/encryptPassword');

async function updatePassword(id, password, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.users.update({ id }, { password: await encryptPassword(password) }, { transacting }),
    table.users,
    _transacting
  );
}

module.exports = { updatePassword };
