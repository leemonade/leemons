import {
  getRememberLoginRequest,
  getUserCenterProfileTokenRequest,
  getUserCentersRequest,
  getUserProfilesRequest,
  getUserProfileTokenRequest,
} from '@users/request';
import { useCallback } from 'react';
import hooks from 'leemons-hooks';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { isString } from 'lodash';

const handleProfileAndCenter = async (profile, center, jwtToken) => {
  if (profile.sysName === 'admin') {
    const response = await getUserProfileTokenRequest(profile.id, jwtToken);
    return { ...response.jwtToken, profile };
  }

  const response = await getUserCenterProfileTokenRequest(center.id, profile.id, jwtToken);
  await hooks.fireEvent('user:change:profile', profile);
  return response.jwtToken;
};

const handleNoProfileAndCenter = async (jwtToken) => {
  const [{ centers }, { profiles }] = await Promise.all([
    getUserCentersRequest(jwtToken),
    getUserProfilesRequest(jwtToken),
  ]);

  if (profiles.length === 1 && profiles[0].sysName === 'admin') {
    const response = await getUserProfileTokenRequest(profiles[0].id, jwtToken);
    return { ...response.jwtToken, profile: profiles[0] };
  }

  if (centers.length === 1 && centers[0].profiles.length === 1 && profiles.length === 1) {
    const response = await getUserCenterProfileTokenRequest(
      centers[0].id,
      centers[0].profiles[0].id,
      jwtToken
    );
    await hooks.fireEvent('user:change:profile', centers[0].profiles[0]);

    return response.jwtToken;
  }

  return jwtToken;
};

async function getAdvancedToken(token) {
  let jwtToken;
  const { profile, center } = await getRememberLoginRequest(token);

  if (profile && center) {
    jwtToken = await handleProfileAndCenter(profile, center, token);
  } else {
    jwtToken = await handleNoProfileAndCenter(token);
  }

  Cookies.set('token', jwtToken);
  hooks.fireEvent('user:cookie:session:change');

  return jwtToken;
}

export default function useOnLoginSuccess() {
  const history = useHistory();

  return useCallback(
    async (token) => {
      const jwtToken = await getAdvancedToken(token);

      const redirectUrl = isString(jwtToken)
        ? '/protected/users/select-profile'
        : '/private/dashboard';

      window.sessionStorage.setItem('boardMessagesModalId', null);
      history.push(redirectUrl);
    },
    [history]
  );
}
