import { useQuery } from '@tanstack/react-query';

import { listProvidersKey } from '../keys/providers';

import listProviders from '@users/request/listProviders';

/**
 * @typedef {object} Provider
 * @property {string} pluginName
 * @property {object} params
 * @property {string} params.image
 * @property {string} params.name
 * @property {object} params.supportedMethods
 *
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult<Provider[]>}
 */
export default function useProvidersList(options) {
  const queryKey = listProvidersKey;
  const queryFn = listProviders;

  return useQuery({ ...options, queryKey, queryFn });
}
