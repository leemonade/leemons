const { encryptPassword } = require('./bcrypt/encryptPassword');

async function updatePassword({ id, password, ctx }) {
  ctx.tx.db.Users.update({ id }, { password: await encryptPassword(password) });
}

module.exports = { updatePassword };
