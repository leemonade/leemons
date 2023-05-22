import { Box, Button, Modal } from '@bubbles-ui/components';
import { useStore } from '@common';
import { SocketIoService } from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SessionContext, SessionProvider } from '@users/context/session';
import prefixPN from '@users/helpers/prefixPN';
import { useUpdateUserProfile } from '@users/hooks';
import { getCookieToken } from '@users/session';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export function apiSessionMiddleware(ctx) {
  if (!ctx.options) ctx.options = {};
  if (ctx.options && !ctx.options.headers) ctx.options.headers = {};
  const token = getCookieToken(true);
  if (ctx.options && token && !ctx.options.headers.Authorization) {
    if (_.isString(token)) {
      ctx.options.headers.Authorization = token;
    } else {
      ctx.options.headers.Authorization = token.userToken;
      if (token.centers.length === 1) {
        ctx.options.headers.Authorization = token.centers[0].token;
      }
      if (_.isObject(ctx.options)) {
        if (ctx.options.allAgents) {
          const allTokens = _.compact(token.centers.concat(token.profiles));
          ctx.options.headers.Authorization = JSON.stringify(_.map(allTokens, 'token'));
        } else if (ctx.options.centerToken) {
          ctx.options.headers.Authorization = ctx.options.centerToken;
        } else if (ctx.options.profileAgents) {
          ctx.options.headers.Authorization = JSON.stringify(_.map(token.profiles, 'token'));
        }
      }
    }
  }
}

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
        hideCloseButton
        closeOnClickOutside={false}
        closeOnEscape={false}
        opened={store.showUpdateDatasetModal}
      >
        <Box>
          <Button color="phatic" onClick={goSetDatasetValues}>
            {t('goPageButton')}
          </Button>
        </Box>
      </Modal>
      {children}
    </SessionProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default SessionContext;
