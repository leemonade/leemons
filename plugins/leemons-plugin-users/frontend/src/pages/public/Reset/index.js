import React, { useMemo } from 'react';
import { useSession } from '@users/session';
import constants from '@users/constants';
import { goLoginPage, goRecoverPage } from '@users/navigate';
import { useHistory } from 'react-router-dom';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { Alert, Box, Button, ContextContainer } from '@bubbles-ui/components';
import { RegisterPasswordForm } from '@users/components/RegisterPasswordForm';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import tLoader from '@multilanguage/helpers/tLoader';
import { useStore } from '@common';
import { canResetRequest, resetRequest } from '@users/request';
import { useNotifications } from '@bubbles-ui/notifications';
import { AuthLayout } from '@users/layout/AuthLayout';
import { AuthContainer } from '@users/components/AuthContainer';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

export default function Reset() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const [store, render] = useStore({});

  const [translations] = useTranslate({ keysStartsWith: prefixPN('reset') });
  const t = tLoader(prefixPN('reset'), translations);

  const [rpTranslations] = useTranslate({ keysStartsWith: prefixPN('registerPassword') });
  const trp = tLoader(prefixPN('registerPassword'), rpTranslations);
  const { t: tCommon } = useCommonTranslate('forms');

  const history = useHistory();
  const notifications = useNotifications();

  function getToken() {
    const query = new URLSearchParams(window.location.search);
    return query.get('token');
  }

  async function canReset() {
    try {
      const { can } = await canResetRequest(getToken());
      return can;
    } catch (err) {
      return false;
    }
  }

  async function checkIfCanResetIfNotRedirect() {
    const can = await canReset();
    if (!can) {
      store.cantReset = true;
      render();
    }
  }

  React.useEffect(() => {
    if (!getToken()) history.push(`/${constants.base}`);
    checkIfCanResetIfNotRedirect();
  }, []);

  const onSubmit = async (data) => {
    try {
      store.loading = true;
      render();

      await resetRequest(getToken(), data.password);

      notifications.showNotification({
        id: new Date().getTime(),
        title: t('passwordSet'),
        severity: 'success',
        autoClose: 5000,
      });

      setTimeout(() => {
        goLoginPage(history);
      }, 1000);
    } catch (err) {
      store.cantReset = true;
      store.loading = false;
      render();
    }
  };

  // ····················································································
  // LITERALS

  const labels = useMemo(
    () => ({
      title: t('title'),
      password: trp('password'),
      repeatPassword: trp('repeatPassword'),
      setPassword: t('resetPassword'),
      checkList: {
        minLength: trp('checkList.minLength'),
        specialChar: trp('checkList.specialChar'),
        number: trp('checkList.number'),
        capital: trp('checkList.capital'),
        match: trp('checkList.match'),
      },
    }),
    [t, trp]
  );

  const placeholders = useMemo(
    () => ({
      repeatPassword: trp('repeatPasswordPlaceholder'),
      password: trp('passwordPlaceholder'),
    }),
    [trp]
  );

  const errorMessages = useMemo(
    () => ({
      repeatPassword: { required: tCommon('required') },
      password: { required: tCommon('required') },
      passwordMatch: trp('passwordMatch'),
    }),
    [tCommon, trp]
  );

  return (
    <AuthLayout>
      <AuthContainer>
        {store.cantReset ? (
          <Alert severity="error" closeable={false}>
            {t('tokenNoValid')}
          </Alert>
        ) : (
          <ContextContainer>
            <RegisterPasswordForm
              labels={labels}
              placeholders={placeholders}
              errorMessages={errorMessages}
              recoverUrl={goRecoverPage(history, true)}
              onSubmit={onSubmit}
              loading={store.loading}
            />

            <Box>
              <Button
                leftIcon={<ChevLeftIcon />}
                variant="link"
                onClick={() => goLoginPage(history)}
              >
                {t('returnLogin')}
              </Button>
            </Box>
          </ContextContainer>
        )}
      </AuthContainer>
    </AuthLayout>
  );
}
