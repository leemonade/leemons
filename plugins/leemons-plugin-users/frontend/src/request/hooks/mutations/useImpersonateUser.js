import { useHistory } from 'react-router-dom';

import { Alert, ContextContainer, Text, getUserFullName } from '@bubbles-ui/components';
import { addErrorAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import prefixPN from '@users/helpers/prefixPN';
import impersonateUser from '@users/request/impersonateUser';

export default function useImpersonateUser() {
  const queryClient = useQueryClient();
  const [t] = useTranslateLoader(prefixPN('impersonate'));
  const history = useHistory();

  const { openConfirmationModal } = useLayout();

  const openModal = (user, callback) =>
    openConfirmationModal({
      title: t('title'),
      description: (
        <ContextContainer>
          <Alert closeable={false} severity="warning" title={t('alert.title')}>
            {t('alert.description')}
          </Alert>
          <Text>{t('message', { name: getUserFullName(user) })}</Text>
        </ContextContainer>
      ),
      labels: {
        confirm: t('confirm'),
        cancel: t('cancel'),
      },
      onConfirm: callback,
    })();

  return useMutation({
    mutationFn: (user) => {
      return new Promise((resolve, reject) => {
        openModal(user, () => {
          impersonateUser(user.id).then(resolve).catch(reject);
        });
      });
    },
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
