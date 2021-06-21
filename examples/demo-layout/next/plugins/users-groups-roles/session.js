import React, { useContext, useEffect } from 'react';
import SessionContext from '@users-groups-roles/context/session';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import Router from 'next/router';

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
      const response = await leemons.api('users-groups-roles/user', {
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
  if (!context) {
    const token = Cookies.get('token');
    if (token) {
      const { data, error } = useSWR('users-groups-roles/user', fetcher(token), {
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
          Router.push(redirectTo);
        }
      }, [redirectTo, redirectIfFound, finished, hasUser]);

      return error ? null : user;
    }
  }
  return context;
}

export function logoutSession(redirectTo) {
  Router.push(`users-groups-roles/auth/logout?redirectTo=${redirectTo}`);
}

export function loginSession(token, redirectTo) {
  Router.push(`users-groups-roles/auth/login?token=${token}&redirectTo=${redirectTo}`);
}
