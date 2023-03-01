import {
  Button,
  ContextContainer,
  PageContainer,
  Select,
  Stack,
  Title,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import { addSuccessAlert } from '@layout/alert';
import SocketIoService from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getPlatformLocalesRequest, updateUserRequest } from '@users/request';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

export default function ChangeLanguage({ session }) {
  const [t, translations] = useTranslateLoader(prefixPN('changeLanguage'));
  const [store, render] = useStore({
    loading: false,
    locales: [],
    locale: session.locale,
  });

  async function load() {
    const { locales } = await getPlatformLocalesRequest();
    store.locales = map(locales, (locale) => ({ label: locale.name, value: locale.code }));
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (store.nextRenderAlert) {
      addSuccessAlert(t('success'));
      store.nextRenderAlert = false;
    }
  }, [JSON.stringify(translations)]);

  SocketIoService.useOn('USER_CHANGE_LOCALE', () => {
    store.nextRenderAlert = true;
  });

  async function save() {
    await updateUserRequest(session.id, { locale: store.locale });
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: t('title'),
        }}
        variant="teacher"
      />
      <PageContainer>
        <ContextContainer divided noFlex>
          <ContextContainer>
            <Title order={3}>{t('interface')}</Title>
            <Select
              label={t('selectLocale')}
              data={store.locales}
              value={store.locale}
              onChange={(e) => {
                store.locale = e;
                render();
              }}
            />
          </ContextContainer>
          <Stack justifyContent="end">
            <Button onClick={save}>{t('save')}</Button>
          </Stack>
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}

ChangeLanguage.propTypes = {
  session: PropTypes.object,
};
