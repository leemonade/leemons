"use strict";

module.exports = {
  newTransaction: async function (ctx) {
    if (ctx.meta.transactionID) {
      return ctx.meta.transactionID;
    }
    if (ctx.tx?.call) {
      ctx.meta.transactionID = await ctx.tx.call(
        "transactions.new",
        undefined,
        {
          meta: { __isInternalCall: true },
        }
      );
      return ctx.meta.transactionID;
    }
    ctx.meta.transactionID = await ctx.call("transactions.new");
    return ctx.meta.transactionID;
  },
  increaseTransactionPending: function (ctx) {
    if (ctx.tx?.call) {
      return ctx.tx.call("transactions.addPendingState", undefined, {
        meta: { __isInternalCall: true },
      });
    }
    return ctx.call("transactions.addPendingState");
  },
  increaseTransactionFinished: function (ctx) {
    if (ctx.tx?.call) {
      return ctx.tx.call("transactions.addFinishedState", undefined, {
        meta: { __isInternalCall: true },
      });
    }
    return ctx.call("transactions.addFinishedState");
  },
  addTransactionState: function (ctx, params, options) {
    if (ctx.tx?.call) {
      return ctx.tx.call("transactions.addTransactionState", params, {
        ...options,
        meta: { ...(options?.meta || {}), __isInternalCall: true },
      });
    }
    return ctx.call("transactions.addTransactionState", params, options);
  },
  rollbackTransaction: function (ctx) {
    if (ctx.tx?.call) {
      return ctx.tx.call("transactions.rollbackTransaction", undefined, {
        meta: { __isInternalCall: true },
      });
    }
    return ctx.call("transactions.rollbackTransaction");
  },
};
