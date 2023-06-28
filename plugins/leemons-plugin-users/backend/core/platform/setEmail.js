/**
 * Set default email por platform
 * @public
 * @static
 * @param {string} email - Email
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setEmail({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-email' },
    {
      key: 'platform-email',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setEmail;
