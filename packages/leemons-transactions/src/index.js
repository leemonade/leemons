"use strict";

module.exports = {
  newTransaction: function (ctx) {
    if (ctx.tx?.call) {
      return ctx.tx.call("transactions.new", undefined, {
        meta: { __isInternalCall: true },
      });
    }
    return ctx.call("transactions.new");
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
