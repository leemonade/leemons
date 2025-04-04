import type { Model } from "@leemons/mongodb";

const DUPLICATED_INDEX_ERROR_CODE = 11000;

interface AcquireLockParams {
  KeyValueModel: Model<any>;
  lockKey?: string;
  timeout?: number;
}

interface LockDocument {
  key: string;
  value: {
    acquired: boolean;
    expiration: Date;
  };
}

/**
 * Acquires a lock for a given name using the KeyValueModel.
 * If the lock is already acquired, the function will return false.
 */
export async function acquireLock({
  KeyValueModel,
  lockKey = "default",
  timeout = 300000 /* 5 minutes */,
}: AcquireLockParams): Promise<boolean> {
  const expirationDate = new Date(Date.now() + timeout);

  try {
    const lock: LockDocument = await KeyValueModel.findOneAndUpdate(
      {
        key: lockKey,
        $or: [
          { "value.acquired": { $ne: true } },
          { "value.expiration": { $lt: new Date() } },
        ],
      },
      { key: lockKey, value: { acquired: true, expiration: expirationDate } },
      { upsert: true, new: true }
    );

    return !!lock;
  } catch (e: any) {
    if (e.code === DUPLICATED_INDEX_ERROR_CODE) {
      return false;
    }

    throw e;
  }
}
