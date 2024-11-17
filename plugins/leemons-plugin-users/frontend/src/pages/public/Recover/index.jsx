import React from 'react';
import { useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import { recoverRequest } from '@users/request';
import { goLoginPage } from '@users/navigate';
import { useHistory } from 'react-router-dom';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { Alert, Box, Button, ContextContainer, TextInput } from '@bubbles-ui/components';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import tLoader from '@multilanguage/helpers/tLoader';
import { useSearchParams, useStore } from '@common';
import { AuthLayout } from '@users/layout/AuthLayout';
import { AuthContainer } from '@users/components/AuthContainer';

export default function Recover() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const [store, render] = useStore({ loading: false });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('recover') });
  const t = tLoader(prefixPN('recover'), translations);

  const history = useHistory();
  const paramsEmail = useSearchParams().get('email')?.replace(' ', '+');

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: paramsEmail,
    },
  });

  register('email', { required: true });
  const email = watch('email');

  const onSubmit = async (data) => {
    try {
      store.message = null;
      store.email = null;
      store.loading = true;
      render();
      const { code } = await recoverRequest(data);
      if (code === 1001) {
        store.message = t('accountNotActive');
      } else {
        store.email = data.email;
      }
      store.loading = false;
      render();
    } catch (err) {
      console.error(err);
      store.loading = false;
      render();
    }
  };

  return (
    <AuthLayout>
      <AuthContainer>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <ContextContainer title={t('title')} description={store.email ? ' ' : t('description')}>
            {!store.email && (
              <TextInput
                label={t('email')}
                error={errors.email ? t('emailRequired') : null}
                value={email}
                onChange={(e) => setValue('email', e.toLowerCase().trim())}
              />
            )}

            {store.email || store.message ? (
              <Alert severity={store.message ? 'warning' : 'success'} closeable={false}>
                {store.message ? store.message : t('emailSendTo', { email: store.email })}
              </Alert>
            ) : null}

            {!store.email && (
              <Box>
                <Button type="submit" fullWidth loading={store.loading}>
                  {t('resetPassword')}
                </Button>
              </Box>
            )}

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
      </AuthContainer>
    </AuthLayout>
  );
}
