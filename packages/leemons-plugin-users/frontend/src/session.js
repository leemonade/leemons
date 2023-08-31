import { SessionContext } from '@users/context/session';
import { updateSessionConfigRequest } from '@users/request';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';
import * as _ from 'lodash';
import { keyBy } from 'lodash';
import { useContext, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';
import { apiSessionMiddleware } from '../globalContext';

/**
 * @private
 * @param {request} req extracted from request response
 * @return {object} object of parse jwt cookie decode object
 */
function getAppCookies(req) {
  const parsedItems = {};
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split('; ');
    cookiesItems.forEach((cookies) => {
      const parsedItem = cookies.split('=');
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
  }
  return parsedItems;
}

/**
 * @public
 * @param {request} req extracted from request response
 * @return {any} user or null
 */
export async function getSession({ req }) {
  try {
    const { token } = getAppCookies(req);
    if (token) {
      const response = await leemons.api('users/user', {
        headers: { Authorization: token },
      });
      return response.user;
    }
    return null;
  } catch (err) {
    return null;
  }
}

const fetcher = () => async () => {
  const result = await leemons.api('users/user');
  result.user.avatar = leemons.apiUrl + result.user.avatar;
  return result;
};

function getUserToken(data) {
  if (data) {
    if (_.isString(data)) {
      return data;
    }
    return data.userToken;
  }
  return null;
}

export function getCookieToken(onlyCookie) {
  let token = Cookies.get('token');

  try {
    token = JSON.parse(token);
  } catch (e) {
    /* AllGood */
  }
  return onlyCookie ? token : getUserToken(token);
}

export function getCentersWithToken() {
  const token = getCookieToken(true);
  return _.isString(token) ? null : token?.centers;
}

export function getSessionConfig() {
  const token = getCookieToken(true);
  return _.isString(token) ? {} : token?.sessionConfig || {};
}

export async function updateSessionConfig(config) {
  const { data } = await updateSessionConfigRequest(config);
  const cookieToken = getCookieToken(true);
  const dataByOld = keyBy(data, 'old');
  if (!_.isObject(cookieToken.sessionConfig)) cookieToken.sessionConfig = {};
  cookieToken.sessionConfig = { ...cookieToken.sessionConfig, ...config };
  if (cookieToken.centers) {
    _.forEach(cookieToken.centers, ({ token }, i) => {
      if (dataByOld[token]) {
        cookieToken.centers[i].token = dataByOld[token].new;
      }
    });
  }
  Cookies.set('token', cookieToken);
}

export function getAuthorizationTokenForAllCenters() {
  const centers = getCentersWithToken();
  return centers ? JSON.stringify(_.map(centers, 'token')) : null;
}

function useContextToken() {
  return getUserToken(useContext(SessionContext));
}

export function useSession({ redirectTo, redirectIfFound } = {}) {
  const history = useHistory();
  let result = null;
  let finished = null;
  let hasUser = null;
  let effect = false;

  const context = useContextToken();
  if (context) {
    effect = true;
    hasUser = Boolean(context);
    result = context;
  }

  const token = getCookieToken();

  const hasSessionMiddleware = useMemo(
    () => leemons.api.hasReq(apiSessionMiddleware),
    [apiSessionMiddleware]
  );

  const { data, error } = useSWR(
    `users/user/${token}?hasSessionMiddleware=${hasSessionMiddleware}`,
    fetcher(),
    {
      revalidateOnFocus: false,
    }
  );

  const user = data && data.user ? data.user : null;
  finished = Boolean(data || error);
  hasUser = Boolean(user);

  if (user) {
    result = user;
  }

  if (!token) {
    effect = true;
    hasUser = Boolean(context);
  }

  useEffect(() => {
    if (!effect) {
      if (!redirectTo || !finished) return;
      if (
        // If redirectTo is set, redirect if the user was not found.
        (redirectTo && !redirectIfFound && !hasUser) ||
        // If redirectIfFound is also set, redirect if the user was found
        (redirectIfFound && hasUser)
      ) {
        if (_.isFunction(redirectTo)) {
          redirectTo(history);
        } else if (_.isString(redirectTo)) {
          history.push(`/${redirectTo}`);
        }
      }
    } else {
      if (!redirectTo) return;
      if (
        // If redirectTo is set, redirect if the user was not found.
        (redirectTo && !redirectIfFound && !hasUser) ||
        // If redirectIfFound is also set, redirect if the user was found
        (redirectIfFound && hasUser)
      ) {
        if (_.isFunction(redirectTo)) {
          redirectTo(history);
        } else if (_.isString(redirectTo)) {
          history.push(`/${redirectTo}`);
        }
      }
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return result;
}

export function logoutSession(history, redirectTo) {
  Cookies.remove('token');
  history.push(redirectTo);
  hooks.fireEvent('user:cookie:session:change');
  // history.push(`/users/public/auth/logout?redirectTo=${redirectTo}`);
}
