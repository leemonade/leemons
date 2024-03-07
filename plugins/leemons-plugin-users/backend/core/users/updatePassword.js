const fetch = require('node-fetch');
const { LeemonsError } = require('@leemons/error');
const { encryptPassword } = require('./bcrypt/encryptPassword');

async function updatePassword({ id, password, ctx }) {
  let user = await ctx.tx.db.Users.findOne({ id }).lean();

  let setPassword = true;
  // Si esta external identity url, le mandamos que cambie la contraseña del usuario (email), si el
  // usuario no existe no dara un error y procedemos a añadir la contraseña en nuestra base de datos
  // como siempre si no da error no seteamos la contraseña en nuestra base de datos
  if (process.env.EXTERNAL_IDENTITY_URL) {
    try {
      // Is no error its done
      const r = await fetch(`${process.env.EXTERNAL_IDENTITY_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password,
          deploymentID: ctx.meta.deploymentID,
          manualPassword: process.env.MANUAL_PASSWORD,
        }),
      });

      const response = await r.json();
      if (!r.ok) {
        throw new LeemonsError(ctx, {
          message: response.message,
          httpStatusCode: r.status,
        });
      }

      setPassword = false;
    } catch (error) {}
  }

  if (setPassword) {
    user = await ctx.tx.db.Users.findOneAndUpdate(
      { id },
      { password: await encryptPassword(password) },
      { lean: true, new: true }
    );
  }

  return user;
}

module.exports = { updatePassword };
