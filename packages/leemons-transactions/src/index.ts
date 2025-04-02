import type { Context } from '@leemons/moleculer';

interface TransactionOptions {
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

interface TransactionState {
  [key: string]: unknown;
}

export async function newTransaction(ctx: Context): Promise<string> {
  if (ctx.meta.transactionID) {
    return ctx.meta.transactionID;
  }
  if (ctx.tx?.call) {
    ctx.meta.transactionID = (await ctx.tx.call('transactions.new', undefined, {
      meta: { __isInternalCall: true },
    })) as string;
    return ctx.meta.transactionID;
  }
  ctx.meta.transactionID = (await ctx.call('transactions.new')) as string;
  return ctx.meta.transactionID;
}

export function increaseTransactionPending(ctx: Context): Promise<void> {
  if (ctx.tx?.call) {
    return ctx.tx.call('transactions.addPendingState', undefined, {
      meta: { __isInternalCall: true },
    });
  }
  return ctx.call('transactions.addPendingState');
}

export function increaseTransactionFinished(ctx: Context): Promise<void> {
  if (ctx.tx?.call) {
    return ctx.tx.call('transactions.addFinishedState', undefined, {
      meta: { __isInternalCall: true },
    });
  }
  return ctx.call('transactions.addFinishedState');
}

export function addTransactionState(
  ctx: Context,
  params: TransactionState,
  options?: TransactionOptions
): Promise<void> {
  if (ctx.tx?.call) {
    return ctx.tx.call('transactions.addTransactionState', params, {
      ...options,
      meta: { ...(options?.meta || {}), __isInternalCall: true },
    });
  }
  return ctx.call('transactions.addTransactionState', params, options);
}

export function rollbackTransaction(ctx: Context): Promise<void> {
  if (ctx.tx?.call) {
    return ctx.tx.call('transactions.rollbackTransaction', undefined, {
      meta: { __isInternalCall: true },
    });
  }
  return ctx.call('transactions.rollbackTransaction');
}
