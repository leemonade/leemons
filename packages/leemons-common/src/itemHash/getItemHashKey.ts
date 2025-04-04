interface GetItemHashKeyParams {
  key: string;
  hash: string;
  useValuePrefix?: boolean;
}

/**
 * Generates a hash key based on the provided key and hash.
 * Optionally prefixes the key with 'value.' based on the useValuePrefix flag.
 */
export function getItemHashKey({
  key,
  hash,
  useValuePrefix = true,
}: GetItemHashKeyParams): string {
  return useValuePrefix ? `value.${key}.${hash}` : `${key}.${hash}`;
}
