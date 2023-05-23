const { increaseTransactionPending } = require("leemons-transactions");

async function increaseTransactionPendingIfNeed({ ignoreTransaction, ctx }) {
  if (!ignoreTransaction && ctx.meta.transactionID)
    await increaseTransactionPending(ctx);
}

module.exports = { increaseTransactionPendingIfNeed };
