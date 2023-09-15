const { encryptPassword } = require('./bcrypt/encryptPassword');

async function updatePassword({ id, password, ctx }) {
  return ctx.tx.db.Users.findOneAndUpdate(
    { id },
    { password: await encryptPassword(password) },
    { lean: true, new: true }
  );
}

module.exports = { updatePassword };
