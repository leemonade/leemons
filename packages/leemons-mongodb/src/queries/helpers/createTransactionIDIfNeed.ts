import type { AnyContext } from '@leemons/moleculer';
import { newTransaction } from '@leemons/transactions';

interface CreateTransactionParams {
  ignoreTransaction?: boolean;
  autoTransaction?: boolean;
  ctx: AnyContext;
}

export async function createTransactionIDIfNeed({
  ignoreTransaction,
  autoTransaction,
  ctx,
}: CreateTransactionParams): Promise<void> {
  if (!ignoreTransaction) {
    if (!ctx.meta.transactionID) {
      if (autoTransaction) {
        ctx.meta.transactionID = await newTransaction(ctx as any);
        ctx.meta.transactionExecutionId = ctx.id;

        if (process.env.DEBUG === 'true') {
          console.log(
            `NEW TRANSACTION from (${ctx.service.name}) ${ctx.action?.name || ctx.event?.name}`
          );
        }
      }
    }
  }
}
