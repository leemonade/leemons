import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Stack, Button, Modal, Paragraph } from '@bubbles-ui/components';
import { SocketIoService } from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SessionContext, SessionProvider } from '@users/context/session';
import prefixPN from '@users/helpers/prefixPN';
import { useUpdateUserProfile } from '@users/hooks';
import { apiSessionMiddleware } from '@users/helpers/apiSessionMiddleware';
import { useSocketConnected } from '@mqtt-socket-io/hooks/useSocketConnected';
import checkUserAgentDatasetsRequest from '@users/request/checkUserAgentDatasets';

export function Provider({ children }) {
  const [t] = useTranslateLoader(prefixPN('needDatasetDataModal'));
  const [showUpdateDatasetModal, setShowUpdateDatasetModal] = React.useState(false);
  const isSocketConnected = useSocketConnected();

  const history = useHistory();
  const location = useLocation();

  useUpdateUserProfile();

  // ·································································
  // INITIAL DATA PROCCESSING

  useEffect(() => {
    leemons.api.useReq(apiSessionMiddleware);
  }, []);

  useEffect(() => {
    if (isSocketConnected) {
      checkUserAgentDatasetsRequest();
    }
  }, [isSocketConnected]);

  // ·································································
  // HANDLERS

  SocketIoService.useOn('USER_AGENT_NEED_UPDATE_DATASET', () => {
    if (
      !showUpdateDatasetModal &&
      location.pathname !== '/private/users/detail' &&
      !location.search.includes('editDataset=true')
    ) {
      setShowUpdateDatasetModal(true);
    }
  });

  function handleOnGoPage() {
    history.push('/private/users/detail?editDataset=true');
    setShowUpdateDatasetModal(false);
  }

  // ·································································
  // RENDER

  return (
    <SessionProvider value={{}}>
      <Modal
        title={t('title')}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        opened={showUpdateDatasetModal}
      >
        <Stack direction="column" spacing={4} fullWidth>
          <Box>
            <Paragraph>{t('description')}</Paragraph>
          </Box>
          <Stack fullWidth justifyContent="end">
            <Button onClick={handleOnGoPage}>{t('goPageButton')}</Button>
          </Stack>
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
