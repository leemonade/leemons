const { LeemonsError } = require('@leemons/error');

function checkIfManualPasswordIsGood({ ctx }) {
  if (!process.env.MANUAL_PASSWORD) {
    throw new LeemonsError(ctx, {
      message: 'Disabled by default specify process.env.MANUAL_PASSWORD to be able to use it.',
    });
  }
  if (ctx.params.manualPassword !== process.env.MANUAL_PASSWORD) {
    throw new LeemonsError(ctx, {
      message: 'Wrong password',
    });
  }

  delete ctx.params.manualPassword;
}

module.exports = { checkIfManualPasswordIsGood };
