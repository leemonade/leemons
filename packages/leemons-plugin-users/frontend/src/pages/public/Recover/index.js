import React from 'react';
import { useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import { recoverRequest } from '@users/request';
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

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));

export default function Recover() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const [store, render] = useStore();

  const [translations] = useTranslate({ keysStartsWith: prefixPN('recover') });
  const t = tLoader(prefixPN('recover'), translations);

  const history = useHistory();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  register('email', { required: true });
  const email = watch('email');

  const onSubmit = async (data) => {
    try {
      store.message = null;
      store.email = null;
      render();
      const { code } = await recoverRequest(data);
      if (code === 1001) {
        store.message = t('accountNotActive');
      } else {
        store.email = data.email;
      }
      render();
    } catch (err) {
      console.error(err);
    }
  };

  const { classes } = PageStyles();

  return (
    <HeroBgLayout>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <ContextContainer title={t('title')} description={t('description')}>
              <TextInput
                label={t('email')}
                error={errors.email ? t('emailRequired') : null}
                value={email}
                onChange={(e) => setValue('email', e)}
              />
              {store.email || store.message ? (
                <Alert severity={store.message ? 'warning' : 'success'} closeable={false}>
                  {store.message ? store.message : t('emailSendTo', { email: store.email })}
                </Alert>
              ) : null}

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
        </Box>
      </Stack>
    </HeroBgLayout>
  );
}
