import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import _ from 'lodash';
import { LoginForm, ThemeProvider } from '@bubbles-ui/components';
import {
  getRememberProfileRequest,
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  loginRequest,
} from '@users/request';
import { getCookieToken, useSession } from '@users/session';
import { goRecoverPage } from '@users/navigate';
import HeroBgLayout from '@users/layout/heroBgLayout';
import prefixPN from '@users/helpers/prefixPN';
import constants from '@users/constants';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import hooks from 'leemons-hooks';

export default function Login() {
  useSession({
    redirectTo: _.isString(getCookieToken(true)) ? 'private/users/select-profile' : constants.base,
    redirectIfFound: true,
  });

  const history = useHistory();
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState(null);

  const { t: tCommon } = useCommonTranslate('forms');

  const [translations] = useTranslate({ keysStartsWith: prefixPN('login') });
  const t = tLoader(prefixPN('login'), translations);

  const onSubmit = async (data) => {
    try {
      setFormStatus('loading');
      setFormError(null);
      const response = await loginRequest(data);
      try {
        // Comprobamos si tiene recordado un perfil
        const { profile } = await getRememberProfileRequest(response.jwtToken);
        if (profile) {
          // Si lo tiene sacamos el token para dicho perfil
          const { jwtToken } = await getUserProfileTokenRequest(profile.id, response.jwtToken);
          await hooks.fireEvent('user:change:profile', profile);
          response.jwtToken = jwtToken;
        } else {
          // Si no lo tiene sacamos todos los perfiles a los que tiene acceso para hacer login
          const { profiles } = await getUserProfilesRequest(response.jwtToken);
          // Si solo tiene un perfil hacemos login automaticamente con ese
          if (profiles.length === 1) {
            const { jwtToken } = await getUserProfileTokenRequest(
              profiles[0].id,
              response.jwtToken
            );
            await hooks.fireEvent('user:change:profile', profiles[0]);
            response.jwtToken = jwtToken;
          }
        }
      } catch (e) {
        //
      }
      // Finalmente metemos el token
      Cookies.set('token', response.jwtToken);
    } catch (err) {
      if (_.isObject(err) && err.status === 401) {
        setFormStatus('error-match');
        setFormError(t('form_error'));
      }
      if (_.isObject(err) && err.status === 500) {
        setFormStatus('unknown-error');
        setFormError(tCommon('unknown_error'));
      }
    }
  };

  const messages = useMemo(
    () => ({
      title: t('title'),
      usernameLabel: t('email'),
      usernamePlaceholder: t('email'),
      passwordLabel: t('password'),
      passwordPlaceholder: t('password'),
      rememberButtonLabel: t('remember_password'),
      loginButtonLabel: t('log_in'),
      signupButtonLabel: t('not_registered'),
    }),
    [t]
  );

  const errorMessages = useMemo(
    () => ({
      usernameRequired: tCommon('required'),
      usernameInvalidFormat: tCommon('email'),
      passwordRequired: tCommon('required'),
    }),
    [tCommon]
  );

  return (
    <ThemeProvider>
      <HeroBgLayout>
        <LoginForm
          messages={messages}
          errorMessages={errorMessages}
          recoverUrl={goRecoverPage(history, true)}
          onSubmit={onSubmit}
          isLoading={formStatus === 'loading'}
          formError={formError}
        />
      </HeroBgLayout>
    </ThemeProvider>
  );
}
