import { Alert } from '@bubbles-ui/components';
import { useNotifications } from '@bubbles-ui/notifications';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import { AuthContainer } from '@users/components/AuthContainer';
import { RegisterPasswordForm } from '@users/components/RegisterPasswordForm';
import constants from '@users/constants';
import prefixPN from '@users/helpers/prefixPN';
import { AuthLayout } from '@users/layout/AuthLayout';
import { goLoginPage, goRecoverPage } from '@users/navigate';
import { getCookieToken, useSession } from '@users/session';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { canRegisterPasswordRequest, registerPasswordRequest } from '../../../request';

export default function RegisterPassword() {
  useSession({
    redirectTo: _.isString(getCookieToken(true))
      ? 'protected/users/select-profile'
      : constants.base,
    redirectIfFound: true,
  });

  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState(null);

  const { t: tCommon } = useCommonTranslate('forms');

  const [translations] = useTranslate({
    keysStartsWith: prefixPN('registerPassword'),
  });
  const t = tLoader(prefixPN('registerPassword'), translations);
  const notifications = useNotifications();

  function getToken() {
    const query = new URLSearchParams(window.location.search);
    return query.get('token');
  }

  async function canRegisterPassword() {
    try {
      const { can } = await canRegisterPasswordRequest(getToken());
      return can;
    } catch (err) {
      return false;
    }
  }

  async function init() {
    try {
      const can = await canRegisterPassword();
      if (!can) {
        setFormStatus('not-can');
      }
    } catch (err) {
      setFormError(err);
    }
  }

  React.useEffect(() => {
    init();
  }, []);

  const onSubmit = async ({ password }) => {
    try {
      setFormStatus('loading');
      setFormError(null);
      await registerPasswordRequest({
        token: getToken(),
        password,
      });

      notifications.showNotification({
        id: new Date().getTime(),
        title: t('passwordSet'),
        severity: 'success',
        autoClose: 5000,
      });

      setTimeout(() => {
        goLoginPage(navigate);
      }, 1000);
    } catch (e) {
      setFormError(e.message);
    }
    setFormStatus(null);
  };

  // ····················································································
  // LITERALS

  const labels = useMemo(
    () => ({
      title: t('title'),
      password: t('password'),
      repeatPassword: t('repeatPassword'),
      setPassword: t('setPassword'),
      checkList: {
        minLength: t('checkList.minLength'),
        specialChar: t('checkList.specialChar'),
        number: t('checkList.number'),
        capital: t('checkList.capital'),
        match: t('checkList.match'),
      },
    }),
    [t]
  );

  const placeholders = useMemo(
    () => ({
      repeatPassword: t('repeatPasswordPlaceholder'),
      password: t('passwordPlaceholder'),
    }),
    [t]
  );

  const errorMessages = useMemo(
    () => ({
      repeatPassword: { required: tCommon('required') },
      password: { required: tCommon('required') },
      passwordMatch: t('passwordMatch'),
    }),
    [tCommon, t]
  );

  // ····················································································
  // STYLES

  return (
    <AuthLayout>
      <AuthContainer>
        {formStatus === 'not-can' ? (
          <Alert severity="error" closeable={false}>
            {t('tokenError')}
          </Alert>
        ) : (
          <RegisterPasswordForm
            labels={labels}
            placeholders={placeholders}
            errorMessages={errorMessages}
            recoverUrl={goRecoverPage(navigate, true)}
            onSubmit={onSubmit}
            loading={formStatus === 'loading'}
            formError={formError}
          />
        )}
      </AuthContainer>
    </AuthLayout>
  );
}
