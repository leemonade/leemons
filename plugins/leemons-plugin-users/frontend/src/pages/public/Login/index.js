import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import { AuthContainer } from '@users/components/AuthContainer';
import { LoginForm } from '@users/components/LoginForm';
import prefixPN from '@users/helpers/prefixPN';
import useOnLoginSuccess from '@users/hooks/useOnLoginSuccess';
import { AuthLayout } from '@users/layout/AuthLayout';
import { goRecoverPage } from '@users/navigate';
import { loginRequest } from '@users/request';
import { getCookieToken, useSession } from '@users/session';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UNKNOWN_ERROR = 'unknown-error';

export default function Login() {
  useSession({
    redirectTo: (navigate) => {
      navigate(
        _.isString(getCookieToken(true)) ? '/protected/users/select-profile' : '/private/dashboard'
      );
    },
    redirectIfFound: true,
  });

  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState(null);
  const onLoginSuccess = useOnLoginSuccess();

  const { t: tCommon } = useCommonTranslate('forms');

  const [translations] = useTranslate({ keysStartsWith: prefixPN('login') });
  const t = tLoader(prefixPN('login'), translations);

  const handleLoginError = (err) => {
    if (err.message === 'exceeded-login-attempts') {
      setFormStatus(UNKNOWN_ERROR);
      setFormError(tCommon('exceededLoginAttempts'));
    } else if (
      (_.isObject(err) && err.httpStatusCode === 401) ||
      err?.message === 'Credentials do not match'
    ) {
      setFormStatus('error-match');
      setFormError(t('form_error'));
    } else if (_.isObject(err) && err.httpStatusCode === 500) {
      setFormStatus(UNKNOWN_ERROR);
      setFormError(tCommon('unknown_error'));
    } else {
      setFormStatus(UNKNOWN_ERROR);
      setFormError(err.message || tCommon('unknown_error'));
    }
  };

  const onSubmit = async (data) => {
    try {
      setFormStatus('loading');
      setFormError(null);
      const response = await loginRequest(data);
      await onLoginSuccess(response?.jwtToken);
    } catch (err) {
      console.error('error', err);
      handleLoginError(err);
    }
  };

  const labels = useMemo(
    () => ({
      title: t('title'),
      username: t('email'),
      password: t('password'),
      remember: t('remember_password'),
      login: t('log_in'),
      signup: t('not_registered'),
    }),
    [t]
  );

  const placeholders = useMemo(
    () => ({
      username: t('email'),
      password: t('password'),
    }),
    [t]
  );

  const errorMessages = useMemo(
    () => ({
      username: {
        required: tCommon('required') || 'Required field',
        invalidFormat: tCommon('email') || 'Invalid format',
      },
      password: { required: tCommon('required') || 'Required field' },
    }),
    [tCommon]
  );

  return (
    <AuthLayout>
      <AuthContainer spacing={0}>
        <LoginForm
          labels={labels}
          placeholders={placeholders}
          errorMessages={errorMessages}
          recoverUrl={goRecoverPage(navigate, true)}
          onSubmit={onSubmit}
          loading={formStatus === 'loading'}
          formError={formError}
        />
      </AuthContainer>
    </AuthLayout>
  );
}
