const { LeemonsError } = require('@leemons/error');

function validateInternalPrivateKey({ ctx }) {
  if (!process.env.MANUAL_PASSWORD) {
    throw new LeemonsError(ctx, {
      message: 'Disabled by default specify process.env.MANUAL_PASSWORD to be able to use it.',
    });
  }
  if (
    ![ctx.params.manualPassword, ctx.params.internalPrivateKey, ctx.params.privateKey].includes(
      process.env.MANUAL_PASSWORD
    )
  ) {
    throw new LeemonsError(ctx, {
      message: 'Invalid Internal Private Key',
    });
  }

  delete ctx.params.manualPassword;
  delete ctx.params.internalPrivateKey;
  delete ctx.params.privateKey;
}

module.exports = { validateInternalPrivateKey };
