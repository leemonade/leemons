import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveConfigRequest } from '../../request';
import { getConfigKey } from '../keys/configKeys';

import prefixPN from '@emails/helpers/prefixPN';

function useSaveConfig() {
  const queryClient = useQueryClient();
  const [t] = useTranslateLoader(prefixPN('preferences'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  return useMutation({
    mutationFn: async (data) => {
      return await saveConfigRequest(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getConfigKey());
      addSuccessAlert(t('settingsSaved'));
    },
    onError: (error) => {
      addErrorAlert(getErrorMessage(error));
    },
  });
}

export { useSaveConfig };
