import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SessionContext, SessionProvider } from '@users/context/session';
import _ from 'lodash';
import { getCookieToken } from '@users/session';

export function Provider({ children }) {
  const apiSessionMiddleware = useCallback((ctx) => {
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
            ctx.options.headers.Authorization = JSON.stringify(_.map(token.centers, 'token'));
          } else if (ctx.options.centerToken) {
            ctx.options.headers.Authorization = ctx.options.centerToken;
          }
        }
      }
    }
  }, []);

  const apiBadDatasetData = useCallback(async (ctx) => {
    console.log(ctx);
  }, []);

  useEffect(() => {
    leemons.api.useReq(apiSessionMiddleware);
    leemons.api.useResError(apiBadDatasetData);
  }, []);

  return <SessionProvider value={{}}>{children}</SessionProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default SessionContext;
