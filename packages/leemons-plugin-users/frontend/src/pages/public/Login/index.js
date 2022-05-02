import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { Box, createStyles, Stack } from '@bubbles-ui/components';
import { LoginForm } from '@bubbles-ui/leemons';
import { getRememberLoginRequest, loginRequest } from '@users/request';
import { getCookieToken, useSession } from '@users/session';
import { goRecoverPage } from '@users/navigate';
import HeroBgLayout from '@users/layout/heroBgLayout';
import prefixPN from '@users/helpers/prefixPN';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
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

export default function Login() {
  useSession({
    redirectTo: (history) => {
      history.push(
        _.isString(getCookieToken(true)) ? '/private/users/select-profile' : '/private/dashboard'
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
      const response = await loginRequest(data);

      try {
        // Comprobamos si tiene recordado un perfil
        const { profile, center } = await getRememberLoginRequest(response.jwtToken);

        if (profile && center) {
          // Si lo tiene sacamos el token para dicho centro y perfil
          const { jwtToken } = await getUserCenterProfileTokenRequest(
            center.id,
            profile.id,
            response.jwtToken
          );

          await hooks.fireEvent('user:change:profile', profile);
          response.jwtToken = jwtToken;
        } else {
          // Si no lo tiene sacamos todos los perfiles a los que tiene acceso para hacer login
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
      } catch (e) {
        //
      }
      // Finalmente metemos el token
      Cookies.set('token', response.jwtToken);
      hooks.fireEvent('user:cookie:session:change');
      history.push(
        _.isString(response.jwtToken) ? '/private/users/select-profile' : '/private/dashboard'
      );
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
      username: { required: tCommon('required'), invalidFormat: tCommon('email') },
      password: { required: tCommon('required') },
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
