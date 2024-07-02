import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Box, Stack, Button, Modal, Paragraph } from '@bubbles-ui/components';
import { useStore } from '@common';
import { SocketIoService } from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SessionContext, SessionProvider } from '@users/context/session';
import prefixPN from '@users/helpers/prefixPN';
import { useUpdateUserProfile } from '@users/hooks';
import { apiSessionMiddleware } from '@users/helpers/apiSessionMiddleware';

export function Provider({ children }) {
  const [t] = useTranslateLoader(prefixPN('needDatasetDataModal'));
  const [store, render] = useStore();

  const history = useHistory();

  useUpdateUserProfile();

  useEffect(() => {
    leemons.api.useReq(apiSessionMiddleware);
  }, []);

  SocketIoService.useOn('USER_AGENT_NEED_UPDATE_DATASET', () => {
    if (!store.showUpdateDatasetModal) {
      store.showUpdateDatasetModal = true;
      render();
    }
  });

  function goSetDatasetValues() {
    history.push(`/private/users/set-dataset-values?callback=${window.location.pathname}`);
    store.showUpdateDatasetModal = false;
    render();
  }

  return (
    <SessionProvider value={{}}>
      <Modal
        title={t('title')}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        opened={store.showUpdateDatasetModal}
      >
        <Box>
          <Paragraph>{t('description')}</Paragraph>
        </Box>
        <Stack fullWidth justifyContent="end">
          <Button onClick={goSetDatasetValues}>{t('goPageButton')}</Button>
        </Stack>
      </Modal>
      {children}
    </SessionProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default SessionContext;
