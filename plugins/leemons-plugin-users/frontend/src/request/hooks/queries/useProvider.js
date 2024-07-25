import { useQuery } from '@tanstack/react-query';

import getProvider from '@users/request/getProvider';
import { getProviderKey } from '../keys/providers';

/**
 * @typedef {object} Provider
 * @property {string} image
 * @property {string} name
 * @property {string} pluginName
 * @property {object} supportedMethods
 *
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult<Provider>}
 */
export default function useProvider(options) {
  const queryKey = getProviderKey;
  const queryFn = getProvider;

  return useQuery({ ...options, queryKey, queryFn });
}
