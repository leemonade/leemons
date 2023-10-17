import { useStore } from '@common';
import { SocketIoService } from '@mqtt-socket-io/service';
import { getCookieToken } from '@users/session';
import hooks from 'leemons-hooks';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export function Provider({ children }) {
  const [store] = useStore();

  async function init() {
    await SocketIoService.disconnect();
    const token = getCookieToken(true);
    if (token && token !== store.token) {
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
      await SocketIoService.connect(leemons.apiUrl, config);
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
