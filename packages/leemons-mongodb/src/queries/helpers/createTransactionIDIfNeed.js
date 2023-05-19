const _ = require("lodash");
const { newTransaction } = require("leemons-transactions");

async function createTransactionIDIfNeed({ autoTransaction, ctx }) {
  if (!ctx.meta.transactionID) {
    if (autoTransaction) {
      ctx.meta.transactionID = await newTransaction(ctx);
    }
  }
}

module.exports = { createTransactionIDIfNeed };
