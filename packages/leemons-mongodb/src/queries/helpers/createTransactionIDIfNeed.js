const _ = require("lodash");
const { newTransaction } = require("leemons-transactions");

async function createTransactionIDIfNeed({
  ignoreTransaction,
  autoTransaction,
  ctx,
}) {
  if (!ignoreTransaction) {
    if (!ctx.meta.transactionID) {
      if (autoTransaction) {
        ctx.meta.transactionID = await newTransaction(ctx);
      }
    }
  }
}

module.exports = { createTransactionIDIfNeed };
