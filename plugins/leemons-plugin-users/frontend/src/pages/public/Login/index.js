import { Box, createStyles, Stack } from '@bubbles-ui/components';
import { LoginForm } from '@users/components/LoginForm';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import HeroBgLayout from '@users/layout/heroBgLayout';
import { goRecoverPage } from '@users/navigate';
import {
  getRememberLoginRequest,
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  loginRequest,
} from '@users/request';
import { getCookieToken, useSession } from '@users/session';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUserCenterProfileTokenRequest, getUserCentersRequest } from '../../../request';

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));

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

  // ····················································································
  // HANDLERS

  const onSubmit = async (data) => {
    try {
      setFormStatus('loading');
      setFormError(null);
      window.sessionStorage.setItem('boardMessagesModalId', null);
      const response = await loginRequest(data);

      try {
        /*
                if (response?.user?.isSuperAdmin) {
                  const { profiles } = await getUserProfilesRequest(response.jwtToken);
                  if (profiles && !_.isEmpty(profiles)) {
                    const { jwtToken } = await getUserProfileTokenRequest(
                      profiles[0].id,
                      response.jwtToken
                    );

                    response.jwtToken = { ...jwtToken, profile: profiles[0] };
                  }
                } else {

                 */
        // ES: Comprobamos si tiene recordado un perfil
        // EN: Check if has remember a profile
        const { profile, center } = await getRememberLoginRequest(response.jwtToken);

        if (profile && center) {
          try {
            if (profile.sysName === 'admin') {
              const { jwtToken } = await getUserProfileTokenRequest(profile.id, response.jwtToken);

              response.jwtToken = { ...jwtToken, profile };
            } else {
              // ES: Si lo tiene sacamos el token para dicho centro y perfil
              // EN: If has, get the token for that center and profile
              const { jwtToken } = await getUserCenterProfileTokenRequest(
                center.id,
                profile.id,
                response.jwtToken
              );

              await hooks.fireEvent('user:change:profile', profile);
              response.jwtToken = jwtToken;
            }
          } catch (er) {
            // ES: Si no lo tiene sacamos todos los perfiles a los que tiene acceso para hacer login
            // EN: If not has, get all the profiles that has access to do login
            const { centers } = await getUserCentersRequest(response.jwtToken);
            // Si solo tiene un perfil hacemos login automaticamente con ese
            if (centers.length === 1 && centers[0].profiles.length === 1) {
              const { jwtToken } = await getUserCenterProfileTokenRequest(
                centers[0].id,
                centers[0].profiles[0].id,
                response.jwtToken
              );

              await hooks.fireEvent('user:change:profile', centers[0].profiles[0]);
              response.jwtToken = jwtToken;
            }
          }
        } else {
          // ES: Si no lo tiene sacamos todos los perfiles a los que tiene acceso para hacer login
          // EN: If not has, get all the profiles that has access to do login
          const [{ centers }, { profiles }] = await Promise.all([
            getUserCentersRequest(response.jwtToken),
            getUserProfilesRequest(response.jwtToken),
          ]);

          // Si solo tiene un perfil (aun que este en muchos centros) y este es el de admin entramos como todos los centros a la vez
          if (profiles.length === 1 && profiles[0].sysName === 'admin') {
            const { jwtToken } = await getUserProfileTokenRequest(
              profiles[0].id,
              response.jwtToken
            );

            response.jwtToken = { ...jwtToken, profile: profiles[0] };
          } else if (
            centers.length === 1 &&
            centers[0].profiles.length === 1 &&
            profiles.length === 1
          ) {
            // Si solo tiene un perfil hacemos login automaticamente con ese
            const { jwtToken } = await getUserCenterProfileTokenRequest(
              centers[0].id,
              centers[0].profiles[0].id,
              response.jwtToken
            );

            await hooks.fireEvent('user:change:profile', centers[0].profiles[0]);
            response.jwtToken = jwtToken;
          }
        }
        // }
      } catch (e) {
        throw e;
      }

      // Finalmente metemos el token
      Cookies.set('token', response.jwtToken);
      hooks.fireEvent('user:cookie:session:change');

      /* if (response.user.isSuperAdmin) {
              history.push('/private/admin/setup');
            } else {

             */
      history.push(
        _.isString(response.jwtToken) ? '/protected/users/select-profile' : '/private/dashboard'
      );
      // }
    } catch (err) {
      console.error('error', err);
      if (err.message === 'exceeded-login-attempts') {
        setFormStatus('unknown-error');
        setFormError(tCommon('exceededLoginAttempts'));
      } else if (
        (_.isObject(err) && err.httpStatusCode === 401) ||
        err?.message === 'Credentials do not match'
      ) {
        setFormStatus('error-match');
        setFormError(t('form_error'));
      } else if (_.isObject(err) && err.httpStatusCode === 500) {
        setFormStatus('unknown-error');
        setFormError(tCommon('unknown_error'));
      } else {
        setFormStatus('unknown-error');
        setFormError(err.message);
      }
    }
  };

  // ····················································································
  // LITERALS

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

  // ····················································································
  // STYLES

  const { classes } = PageStyles();

  return (
    <HeroBgLayout>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>
          <LoginForm
            labels={labels}
            placeholders={placeholders}
            errorMessages={errorMessages}
            recoverUrl={goRecoverPage(history, true)}
            onSubmit={onSubmit}
            loading={formStatus === 'loading'}
            formError={formError}
          />
        </Box>
      </Stack>
    </HeroBgLayout>
  );
}
