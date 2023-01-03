import React from 'react';
import { useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import { goLoginPage } from '@users/navigate';
import { useHistory } from 'react-router-dom';
import HeroBgLayout from '@users/layout/heroBgLayout';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  createStyles,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import tLoader from '@multilanguage/helpers/tLoader';
import { useStore } from '@common';
import { canResetRequest, resetRequest } from '@users/request';

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));
export default function Reset() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const [store, render] = useStore();

  const [translations] = useTranslate({ keysStartsWith: prefixPN('reset') });
  const t = tLoader(prefixPN('reset'), translations);

  const history = useHistory();

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

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  register('password', { required: true });
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await resetRequest(getToken(), data.password);
      goLoginPage(history);
    } catch (err) {
      store.cantReset = true;
      render();
    }
  };

  const { classes } = PageStyles();

  return (
    <HeroBgLayout>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>
          {store.cantReset ? (
            <Alert severity="error" closeable={false}>
              {t('tokenNoValid')}
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <ContextContainer title={t('title')} description={t('description')}>
                <TextInput
                  label={t('password')}
                  error={errors.password ? t('passwordRequired') : null}
                  value={password}
                  onChange={(e) => setValue('password', e)}
                />

                <Box>
                  <Button type="submit" fullWidth>
                    {t('resetPassword')}
                  </Button>
                </Box>

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
            </form>
          )}
        </Box>
      </Stack>
    </HeroBgLayout>
  );
}
