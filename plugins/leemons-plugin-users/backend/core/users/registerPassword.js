const fetch = require('node-fetch');
const { LeemonsError } = require('@leemons/error');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');
const { sendActivationEmailsByProfileToUser } = require('./sendActivationEmailsByProfileToUser');
const { profiles: getUserProfiles } = require('./profiles');

async function registerPassword({ token, password, ctx }) {
  const config = await getRegisterPasswordConfig({ token, ctx });

  let user = await ctx.tx.db.Users.findOne({ id: config.user.id }).lean();

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

  const toUpdate = {
    status: 'password-registered',
    active: true,
  };

  if (setPassword) {
    toUpdate.password = await encryptPassword(password);
  }

  user = await ctx.tx.db.Users.findOneAndUpdate({ id: config.user.id }, toUpdate, {
    new: true,
    lean: true,
  });

  await ctx.tx.db.UserRegisterPassword.deleteOne({ id: config.recoveryId });

  if (setPassword) {
    const profiles = await getUserProfiles({ user: user.id, ctx });
    profiles.map((profile) => sendActivationEmailsByProfileToUser({ user, profile, ctx }));
  }

  return user;
}

module.exports = {
  registerPassword,
};
