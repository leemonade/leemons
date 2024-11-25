import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import { useQuery } from '@tanstack/react-query';

import fetchConfig from '../../request/getConfig';
import { getConfigKey } from '../keys/configKeys';

function useConfig({ options } = {}) {
  const queryKey = getConfigKey();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const queryFn = async () => {
    const result = await fetchConfig();
    return result.configs;
  };

  return useQuery({
    queryKey,
    queryFn,
    onError: (error) => {
      addErrorAlert(getErrorMessage(error));
    },
    ...options,
  });
}

export { useConfig };
