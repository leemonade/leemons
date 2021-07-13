import * as _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import SessionContext from '@users/context/session';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import Router from 'next/router';
import constants from './constants';

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

const fetcher = (token) => (url) =>
  leemons.api(url, {
    headers: { Authorization: token },
  });

export function useSession({ redirectTo, redirectIfFound } = {}) {
  const context = useContext(SessionContext);
  let effect = false;
  if (!context) {
    const token = Cookies.get('token');
    if (token) {
      const { data, error } = useSWR('users/user', fetcher(token), {
        revalidateOnFocus: false,
      });

      const user = data && data.user ? data.user : null;
      const finished = Boolean(data || error);
      const hasUser = Boolean(user);

      useEffect(() => {
        if (!redirectTo || !finished) return;
        if (
          // If redirectTo is set, redirect if the user was not found.
          (redirectTo && !redirectIfFound && !hasUser) ||
          // If redirectIfFound is also set, redirect if the user was found
          (redirectIfFound && hasUser)
        ) {
          if (_.isFunction(redirectTo)) {
            redirectTo();
          } else if (_.isString(redirectTo)) {
            Router.push(redirectTo);
          }
        }
      }, [redirectTo, redirectIfFound, finished, hasUser]);

      return error ? null : user;
    } else {
      effect = true;
    }
  } else {
    effect = true;
  }
  if (effect) {
    const hasUser = Boolean(context);
    useEffect(() => {
      if (!redirectTo) return;
      if (
        // If redirectTo is set, redirect if the user was not found.
        (redirectTo && !redirectIfFound && !hasUser) ||
        // If redirectIfFound is also set, redirect if the user was found
        (redirectIfFound && hasUser)
      ) {
        Router.push(`/${redirectTo}`);
      }
    }, [redirectTo, redirectIfFound, hasUser]);
  }
  return context;
}

export function logoutSession(redirectTo) {
  Router.push(`/${constants.frontend.authLogout}?redirectTo=${redirectTo}`);
}

export function loginSession(token, redirectTo) {
  Router.push(`/${constants.frontend.authLogin}?token=${token}&redirectTo=${redirectTo}`);
}
