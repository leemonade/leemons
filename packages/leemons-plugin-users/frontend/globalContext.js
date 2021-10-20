import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SessionProvider, SessionContext } from '@users/context/session';
import _ from 'lodash';
import { getCookieToken } from '../../../examples/demo-auth/next/plugins/users/session';

export function Provider({ children }) {
  const apiSessionMiddleware = useCallback((ctx) => {
    /*
    const urlConfig = url;
    if (_.isObject(url)) {
      let goodUrl = url.url;
      _.forIn(url.query, (value, key) => {
        goodUrl = _.replace(goodUrl, `:${key}`, value);
      });
      url = goodUrl;
    }
    if (!ctx.options) ctx.options = {};
    if (ctx.options && !ctx.options.headers) ctx.options.headers = {};
    const token = getCookieToken(true);
    if (config && token && !config.headers.Authorization) {
      if (_.isString(token)) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = token.userToken;
        if (token.centers.length === 1) {
          config.headers.Authorization = token.centers[0].token;
        }
        if (_.isObject(urlConfig)) {
          if (urlConfig.allAgents) {
            config.headers.Authorization = JSON.stringify(_.map(token.centers, 'token'));
          } else if (urlConfig.centerToken) {
            config.headers.Authorization = urlConfig.centerToken;
          }
        }
      }
    }

     */
  }, []);

  useEffect(() => {
    leemons.api.useReq(apiSessionMiddleware);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}

Provider.propTypes = {
  children: PropTypes.element,
};

export default SessionContext;
