import { SessionContext } from '@users/context/session';
import { updateSessionConfigRequest } from '@users/request';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';
import * as _ from 'lodash';
import { keyBy } from 'lodash';
import { useContext, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';
import { apiSessionMiddleware } from './helpers/apiSessionMiddleware';

function getJWTToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('jwtToken');
}

const jwtToken = getJWTToken();
if (jwtToken) {
  Cookies.set('token', jwtToken);
}

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
      const response = await leemons.api('v1/users/users', {
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
  const result = await leemons.api('v1/users/users');
  if (!result.user?.avatar?.startsWith(leemons.apiUrl)) {
    result.user.avatar = `${leemons.apiUrl}${result.user.avatar}`;
  }
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
  let token = null;
  const _jwtToken = getJWTToken();

  if (_jwtToken) {
    token = _jwtToken;
  } else {
    token = Cookies.get('token');
  }

  const domain = /:\/\/([^/]+)/.exec(window.location.href)[1];
  const subdomain = domain.split('.')[0];
  const domainWithOutSubdomain = domain.split('.').slice(1).join('.');
  if (!token) {
    token = Cookies.get(`token_${subdomain}`);

    if (token) {
      Cookies.set('token', token);
    }
  }

  if (Cookies.get(`token_${subdomain}`)) {
    Cookies.remove(`token_${subdomain}`, {
      domain: `.${domainWithOutSubdomain}`,
    });
  }

  try {
    token = JSON.parse(token);
  } catch (e) {
    /* AllGood */
  }
  return onlyCookie ? token : getUserToken(token);
}

export function currentProfileIsSuperAdmin() {
  const data = getCookieToken(true);
  if (data?.profile) {
    const profile = _.find(data.profiles, { id: data.profile });
    return profile?.sysName === 'super';
  }
  return false;
}

export function currentProfileIsAdmin() {
  const data = getCookieToken(true);
  if (data?.profile) {
    const profile = _.find(data.profiles, {
      id: _.isString(data.profile) ? data.profile : data.profile?.id,
    });
    return profile?.sysName === 'admin';
  }
  return false;
}

export function getSessionCenter() {
  const token = getCookieToken(true);
  if (_.isString(token)) {
    return null;
  }
  if (!token?.profile && token?.centers?.length === 1) {
    return token?.centers[0];
  }
  return (
    token?.centers?.find((c) => c.profiles?.map(({ id }) => id).includes(token?.profile)) ??
    token?.centers?.[0]
  );
}

export function getSessionProfile() {
  const token = getCookieToken(true);
  const center = getSessionCenter();
  return (
    center?.profiles?.find((p) => p.id === token?.profile) ??
    center?.profiles?.[0] ??
    token?.profile
  );
}

export function getSessionUserAgent() {
  const token = getCookieToken(true);
  return token?.centers?.[0]?.userAgentId;
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
  const cookieToken = getCookieToken(true) ?? {};
  const dataByOld = keyBy(data, 'old');
  if (!_.isObject(cookieToken?.sessionConfig)) {
    cookieToken.sessionConfig = {};
  }
  cookieToken.sessionConfig = { ...cookieToken.sessionConfig, ...config };
  if (Array.isArray(cookieToken?.centers)) {
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
