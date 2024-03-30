import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { Box, createStyles, Stack } from '@bubbles-ui/components';
import { LoginForm } from '@users/components/LoginForm';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import { goRecoverPage } from '@users/navigate';
import { AuthLayout } from '@users/layout/AuthLayout';
import { AuthContainer } from '@users/components/AuthContainer';
import {
  getRememberLoginRequest,
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  loginRequest,
} from '@users/request';
import { getCookieToken, useSession } from '@users/session';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';
import { getUserCenterProfileTokenRequest, getUserCentersRequest } from '../../../request';

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));

const UNKNOWN_ERROR = 'unknown-error';

export default function Login() {
  useSession({
    redirectTo: (history) => {
      history.push(
        _.isString(getCookieToken(true)) ? '/protected/users/select-profile' : '/private/dashboard'
      );
    },
    redirectIfFound: true,
  });

  const history = useHistory();
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState(null);

  const { t: tCommon } = useCommonTranslate('forms');

  const [translations] = useTranslate({ keysStartsWith: prefixPN('login') });
  const t = tLoader(prefixPN('login'), translations);

  const handleProfileAndCenter = async (profile, center, jwtToken) => {
    if (profile.sysName === 'admin') {
      const response = await getUserProfileTokenRequest(profile.id, jwtToken);
      return { ...response.jwtToken, profile };
    }
    const response = await getUserCenterProfileTokenRequest(center.id, profile.id, jwtToken);
    await hooks.fireEvent('user:change:profile', profile);
    return response.jwtToken;
  };

  const handleNoProfileAndCenter = async (jwtToken) => {
    const [{ centers }, { profiles }] = await Promise.all([
      getUserCentersRequest(jwtToken),
      getUserProfilesRequest(jwtToken),
    ]);

    if (profiles.length === 1 && profiles[0].sysName === 'admin') {
      const response = await getUserProfileTokenRequest(profiles[0].id, jwtToken);
      return { ...response.jwtToken, profile: profiles[0] };
    }

    if (centers.length === 1 && centers[0].profiles.length === 1 && profiles.length === 1) {
      const response = await getUserCenterProfileTokenRequest(
        centers[0].id,
        centers[0].profiles[0].id,
        jwtToken
      );
      await hooks.fireEvent('user:change:profile', centers[0].profiles[0]);

      return response.jwtToken;
    }

    return jwtToken;
  };

  const handleLoginSuccess = async (token) => {
    let jwtToken;
    const { profile, center } = await getRememberLoginRequest(token);

    if (profile && center) {
      jwtToken = await handleProfileAndCenter(profile, center, token);
    } else {
      jwtToken = await handleNoProfileAndCenter(token);
    }

    Cookies.set('token', jwtToken);
    hooks.fireEvent('user:cookie:session:change');

    const redirectUrl = _.isString(jwtToken)
      ? '/protected/users/select-profile'
      : '/private/dashboard';

    history.push(redirectUrl);
  };

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
      window.sessionStorage.setItem('boardMessagesModalId', null);
      const response = await loginRequest(data);
      await handleLoginSuccess(response?.jwtToken);
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

  const { classes } = PageStyles();

  return (
    <AuthLayout>
      <AuthContainer spacing={0}>
        <LoginForm
          labels={labels}
          placeholders={placeholders}
          errorMessages={errorMessages}
          recoverUrl={goRecoverPage(history, true)}
          onSubmit={onSubmit}
          loading={formStatus === 'loading'}
          formError={formError}
        />
      </AuthContainer>
    </AuthLayout>
  );
}
