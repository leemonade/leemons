import { LoadingOverlay } from "@bubbles-ui/components";
import { useStore } from "@common";
import { useDeploymentConfig } from "@deployment-manager/hooks/useDeploymentConfig";
import PropTypes from "prop-types";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import LocaleContext from "../contexts/translations";
import { getSettingsRequest } from "../request/settings";

const UserRedirect = ({ to }) => {
  const [store, render] = useStore({
    loading: true,
  });
  const deploymentConfig = useDeploymentConfig({
    pluginName: "users",
    ignoreVersion: true,
  });
  const { loadLocale } = React.useContext(LocaleContext);
  const { pathname } = useLocation();

  const getComponent = (url, comp) => {
    if (pathname === url) {
      return comp;
    }
    return <Navigate to={url} replace />;
  };

  const getRedirect = (settings, isSuperAdmin) => {
    if (settings.configured) {
      if (isSuperAdmin) {
        return getComponent(
          deploymentConfig?.superRedirectUrl || "/private/admin/setup",
          to
        );
      }
      if (pathname === "/admin/login") {
        return getComponent("/users/login", to);
      }
      return <Navigate to="/private/dashboard" replace />;
    }

    // If not configured yet but user is UserAdmin, just redirect to the page requested
    if (isSuperAdmin) {
      let toPath = pathname;

      if (pathname === "/admin") {
        toPath = deploymentConfig?.superRedirectUrl || "/private/admin/setup";
      }

      return getComponent(toPath, to);
    }

    if (settings.status === "ADMIN_CREATED") {
      return getComponent("/users/login", to);
    }

    if (settings.status === "LOCALIZED") {
      return getComponent("/admin/signup", to);
    }

    return getComponent("/admin/welcome", to);
  };

  const getSettings = async () => {
    store.loading = true;
    render();

    try {
      let userToken = null;
      try {
        userToken = await leemons.api(`v1/users/users`);
      } catch (e) {
        leemons.log.debug("Token not valid or session expired");
      }
      const response = await getSettingsRequest();

      if (response.settings?.lang) {
        loadLocale(response.settings?.lang);
      }

      store.component = getRedirect(
        response.settings || {},
        userToken?.user?.isSuperAdmin
      );
      store.loading = false;
      render();
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (deploymentConfig !== undefined) {
        await getSettings();
      }
    })();
  }, [to, pathname, deploymentConfig]);

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return store.component;
};

UserRedirect.propTypes = {
  to: PropTypes.node,
};

export { UserRedirect };
export default UserRedirect;
