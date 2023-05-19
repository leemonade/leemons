"use strict";

module.exports = {
  newTransaction: function (ctx) {
    return ctx.call("transactions.new");
  },
  increaseTransactionPending: function (ctx) {
    return ctx.call("transactions.addPendingState");
  },
  increaseTransactionFinished: function (ctx) {
    return ctx.call("transactions.addFinishedState");
  },
  addTransactionState: function (ctx, params, options) {
    return ctx.call("transactions.addTransactionState", params, options);
  },
  rollbackTransaction: function (ctx) {
    return ctx.call("transactions.rollbackTransaction");
  },
};
