import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { Alert, Box, createStyles, Stack } from '@bubbles-ui/components';
import { RegisterPasswordForm } from '@bubbles-ui/leemons';
import { getCookieToken, useSession } from '@users/session';
import { goLoginPage, goRecoverPage } from '@users/navigate';
import HeroBgLayout from '@users/layout/heroBgLayout';
import prefixPN from '@users/helpers/prefixPN';
import constants from '@users/constants';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { canRegisterPasswordRequest, registerPasswordRequest } from '../../../request';

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));

export default function RegisterPassword() {
  useSession({
    redirectTo: _.isString(getCookieToken(true)) ? 'private/users/select-profile' : constants.base,
    redirectIfFound: true,
  });

  const history = useHistory();
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState(null);

  const { t: tCommon } = useCommonTranslate('forms');

  const [translations] = useTranslate({ keysStartsWith: prefixPN('registerPassword') });
  const t = tLoader(prefixPN('registerPassword'), translations);

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
      goLoginPage(history);
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

  const { classes } = PageStyles();

  return (
    <HeroBgLayout>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>
          {formStatus === 'not-can' ? (
            <Alert severity="error" closeable={false}>
              {t('tokenError')}
            </Alert>
          ) : (
            <RegisterPasswordForm
              labels={labels}
              placeholders={placeholders}
              errorMessages={errorMessages}
              recoverUrl={goRecoverPage(history, true)}
              onSubmit={onSubmit}
              loading={formStatus === 'loading'}
              formError={formError}
            />
          )}
        </Box>
      </Stack>
    </HeroBgLayout>
  );
}
