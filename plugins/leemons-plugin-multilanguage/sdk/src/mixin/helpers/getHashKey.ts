import type { GetHashKeyParams } from './types';

/**
 * Generates a hash key based on the provided locale and hash.
 * Optionally prefixes the key with 'value.' based on the useValuePrefix flag.
 *
 * @param {GetHashKeyParams & { useValuePrefix?: boolean }} params - The parameters for generating the hash key.
 * @returns {string} The generated hash key.
 */
export function getHashKey({
  locale,
  hash,
  useValuePrefix = true,
}: GetHashKeyParams & { useValuePrefix?: boolean }): string {
  return useValuePrefix ? `value.${locale}.${hash}` : `${locale}.${hash}`;
}
