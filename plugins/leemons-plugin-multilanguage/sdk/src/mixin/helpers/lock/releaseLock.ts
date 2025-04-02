import type { AcquireLockParams } from '../types';
import { getLockName } from './getLockName';

/**
 * Releases a lock for a given name using the KeyValueModel.
 *
 * @param {AcquireLockParams} params - The parameters for releasing a lock.
 * @returns {Promise<void>} - A promise that resolves when the lock is released.
 */
export async function releaseLock({
  KeyValueModel,
  lockName = 'default',
}: Omit<AcquireLockParams, 'timeout'>): Promise<void> {
  const lockKey = getLockName(lockName);
  await KeyValueModel.deleteOne({ key: lockKey });
}
