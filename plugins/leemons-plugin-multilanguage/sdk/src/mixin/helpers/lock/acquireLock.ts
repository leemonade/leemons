import type { AcquireLockParams, Lock } from '../types';
import { getLockName } from './getLockName';

const DUPLICATED_INDEX_ERROR_CODE = 11000;

/**
 * Acquires a lock for a given name using the KeyValueModel.
 * If the lock is already acquired, the function will return false.
 *
 * @param {AcquireLockParams} params - The parameters for acquiring a lock.
 * @returns {Promise<boolean>} - A promise that resolves to true if the lock was successfully acquired, false otherwise.
 */
export async function acquireLock({
  KeyValueModel,
  lockName = 'default',
  timeout = 300000 /* 5 minutes */,
}: AcquireLockParams): Promise<boolean> {
  const lockKey = getLockName(lockName);
  const expirationDate = new Date(Date.now() + timeout);

  try {
    const lock = (await KeyValueModel.findOneAndUpdate(
      {
        key: lockKey,
        $or: [{ 'value.acquired': { $ne: true } }, { 'value.expiration': { $lt: new Date() } }],
      },
      { key: lockKey, value: { acquired: true, expiration: expirationDate } },
      { upsert: true, new: true }
    )) as Lock | null;

    return !!lock;
  } catch (e: any) {
    if (e.code === DUPLICATED_INDEX_ERROR_CODE) {
      return false;
    }

    throw e;
  }
}
