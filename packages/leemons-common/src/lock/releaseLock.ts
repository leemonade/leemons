import type { Model } from "@leemons/mongodb";

interface ReleaseLockParams {
  KeyValueModel: Model<any>;
  lockKey?: string;
}

/**
 * Releases a lock for a given name using the KeyValueModel.
 */
export async function releaseLock({
  KeyValueModel,
  lockKey = "default",
}: ReleaseLockParams): Promise<void> {
  await KeyValueModel.deleteOne({ key: lockKey });
}
