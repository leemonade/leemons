const { increaseTransactionFinished } = require("leemons-transactions");

async function increaseTransactionFinishedIfNeed({ ctx }) {
  if (ctx.meta.transactionID) await increaseTransactionFinished(ctx);
}

module.exports = { increaseTransactionFinishedIfNeed };
