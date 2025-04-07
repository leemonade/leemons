import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import hooks from "@leemons/hooks";
import Cookies from "js-cookie";
import { isString } from "lodash";

import {
  getRememberLoginRequest,
  getUserCenterProfileTokenRequest,
  getUserCentersRequest,
  getUserProfileTokenRequest,
  getUserProfilesRequest,
} from "@users/request";

const handleProfileAndCenter = async (profile, center, jwtToken) => {
  if (profile.sysName === "admin" || profile.sysName === "super") {
    const response = await getUserProfileTokenRequest(profile.id, jwtToken);
    await hooks.fireEvent("user:change:profile", profile);
    return { ...response.jwtToken, profile };
  }

  if (center) {
    const response = await getUserCenterProfileTokenRequest(center.id, profile.id, jwtToken);
    await hooks.fireEvent("user:change:profile", profile);
    return response.jwtToken;
  }
};

const handleNoProfileAndCenter = async (jwtToken) => {
  const [{ centers }, { profiles }] = await Promise.all([
    getUserCentersRequest(jwtToken),
    getUserProfilesRequest(jwtToken),
  ]);

  if (profiles.length === 1 && profiles[0].sysName === "admin") {
    const response = await getUserProfileTokenRequest(profiles[0].id, jwtToken);
    return { ...response.jwtToken, profile: profiles[0] };
  }

  if (centers.length === 1 && centers[0].profiles.length === 1 && profiles.length === 1) {
    const response = await getUserCenterProfileTokenRequest(
      centers[0].id,
      centers[0].profiles[0].id,
      jwtToken
    );
    await hooks.fireEvent("user:change:profile", centers[0].profiles[0]);

    return response.jwtToken;
  }

  return jwtToken;
};

async function getAdvancedToken(token) {
  let jwtToken;
  const { profile, center } = await getRememberLoginRequest(token);

  if (profile && (center || profile.sysName === "super")) {
    jwtToken = await handleProfileAndCenter(profile, center, token);
  } else {
    jwtToken = await handleNoProfileAndCenter(token);
  }

  Cookies.set("token", jwtToken);
  hooks.fireEvent("user:cookie:session:change");

  return { jwtToken, profile };
}

export default function useOnLoginSuccess() {
  const navigate = useNavigate();

  return useCallback(
    async (token) => {
      const { profile, jwtToken } = await getAdvancedToken(token);

      window.sessionStorage.setItem("boardMessagesModalId", null);

      if (profile?.sysName === "super") {
        return navigate("/private/admin/setup");
      }

      const redirectUrl = isString(jwtToken)
        ? "/protected/users/select-profile"
        : "/private/dashboard";

      navigate(redirectUrl);
    },
    [navigate]
  );
}
