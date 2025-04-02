import type { Context } from '@leemons/moleculer';
import { increaseTransactionFinished } from '@leemons/transactions';

interface IncreaseTransactionFinishedParams {
  ignoreTransaction?: boolean;
  ctx: Context;
}

export async function increaseTransactionFinishedIfNeed({
  ignoreTransaction,
  ctx,
}: IncreaseTransactionFinishedParams): Promise<void> {
  if (!ignoreTransaction && ctx.meta.transactionID) {
    await increaseTransactionFinished(ctx as any);
  }
}
