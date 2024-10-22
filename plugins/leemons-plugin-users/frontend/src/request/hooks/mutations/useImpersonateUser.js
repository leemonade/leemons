import { useHistory } from 'react-router-dom';

import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import prefixPN from '@users/helpers/prefixPN';
import impersonateUser from '@users/request/impersonateUser';

export default function useImpersonateUser() {
  const queryClient = useQueryClient();
  const [t] = useTranslateLoader(prefixPN('create_users'));
  const history = useHistory();

  return useMutation({
    mutationFn: (id) => impersonateUser(id),
    onSuccess: async (jwtToken) => {
      Cookies.set('impersonated', 'true');
      const savedToken = Cookies.set('token', jwtToken);

      if (!savedToken) {
        throw new Error('Failed to save token');
      }

      history.push('/protected/users/select-profile');
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      addErrorAlert(t('failedImpersonate'), error.message);
    },
  });
}
