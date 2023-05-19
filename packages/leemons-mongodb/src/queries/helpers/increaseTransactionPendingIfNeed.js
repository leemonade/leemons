const { increaseTransactionPending } = require("leemons-transactions");

async function increaseTransactionPendingIfNeed({ ctx }) {
  if (ctx.meta.transactionID) await increaseTransactionPending(ctx);
}

module.exports = { increaseTransactionPendingIfNeed };
