import type { AnyContext } from '@leemons/moleculer';
import { increaseTransactionPending } from '@leemons/transactions';

interface IncreaseTransactionPendingParams {
  ignoreTransaction?: boolean;
  ctx: AnyContext;
}

export async function increaseTransactionPendingIfNeed({
  ignoreTransaction,
  ctx,
}: IncreaseTransactionPendingParams): Promise<void> {
  if (!ignoreTransaction && ctx.meta.transactionID) {
    await increaseTransactionPending(ctx as any);
  }
}
