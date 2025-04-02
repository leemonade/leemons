import type { AnyContext } from '@leemons/moleculer';
import { increaseTransactionFinished } from '@leemons/transactions';

interface IncreaseTransactionFinishedParams {
  ignoreTransaction?: boolean;
  ctx: AnyContext;
}

export async function increaseTransactionFinishedIfNeed({
  ignoreTransaction,
  ctx,
}: IncreaseTransactionFinishedParams): Promise<void> {
  if (!ignoreTransaction && ctx.meta.transactionID) {
    await increaseTransactionFinished(ctx as any);
  }
}
