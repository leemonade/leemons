import { LOCK_NAME } from '../../constants';

/**
 * Returns the lock name for the given name.
 *
 * @param {string} name - The name of the lock.
 * @returns {string} - The lock name.
 */
export function getLockName(name: string): string {
  return `${LOCK_NAME}.${name}`;
}
