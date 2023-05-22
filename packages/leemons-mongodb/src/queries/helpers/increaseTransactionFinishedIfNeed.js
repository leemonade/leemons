const { increaseTransactionFinished } = require("leemons-transactions");

async function increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx }) {
  if (!ignoreTransaction && ctx.meta.transactionID)
    await increaseTransactionFinished(ctx);
}

module.exports = { increaseTransactionFinishedIfNeed };
