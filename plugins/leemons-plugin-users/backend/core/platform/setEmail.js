/**
 * Set default email por platform
 * @public
 * @static
 * @param {string} email - Email
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setEmail({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-email' },
    {
      key: 'platform-email',
      value,
    },
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );
}

module.exports = setEmail;
