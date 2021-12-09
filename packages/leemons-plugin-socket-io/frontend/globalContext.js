import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getCookieToken } from '@users/session';
import { SocketIoService } from '@socket-io/service';
import hooks from 'leemons-hooks';

export function Provider({ children }) {
  const token = getCookieToken(true);

  useEffect(() => {
    if (token) {
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
      SocketIoService.connect(window.location.origin, config);
      SocketIoService.onAny((event, data) =>
        hooks.fireEvent('socket.io:onAny', {
          event,
          data,
        })
      );
    }
    return () => SocketIoService.disconnect();
  }, [token]);

  return children;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default null;
