import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getCookieToken } from '@users/session';
import { useStore } from '@common';
import { SocketIoService } from '@socket-io/service';
import hooks from 'leemons-hooks';

export function Provider({ children }) {
  const [store] = useStore();

  function init() {
    SocketIoService.disconnect();
    const token = getCookieToken(true);
    if (token && token !== store.token) {
      // console.log(token);

      const config = {
        auth: {},
      };
      if (_.isString(token)) {
        config.auth.token = token;
      } else if (token.centers.length === 1) {
        config.auth.token = token.centers[0].token;
      } else {
        config.auth.token = JSON.stringify(_.map(token.centers, 'token'));
      }
      SocketIoService.connect(leemons.serverUrl, config);
      SocketIoService.onAny((event, data) =>
        hooks.fireEvent('socket.io:onAny', {
          event,
          data,
        })
      );
      store.token = token;
    }
  }

  useEffect(() => {
    init();
    hooks.addAction('user:cookie:session:change', init);
    return () => {
      SocketIoService.disconnect();
      hooks.removeAction('user:cookie:session:change', init);
    };
  });

  return children;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default null;
