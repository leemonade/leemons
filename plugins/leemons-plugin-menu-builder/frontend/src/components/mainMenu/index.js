import React, { useEffect, useState, useMemo } from 'react';
import { Spotlight } from '@bubbles-ui/components';
import { useStore } from '@common';
import { getMenu } from '@menu-builder/helpers';
import prefixPN from '@menu-builder/helpers/prefixPN';
import SocketIoService from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getUserCentersRequest, getUserProfilesRequest } from '@users/request';
import { currentProfileIsAdmin, currentProfileIsSuperAdmin, useSession } from '@users/session';
import hooks from 'leemons-hooks';
import PropTypes from 'prop-types';
import getPlatformName from '@users/request/getPlatformName';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import getPlatformLocales from '@users/request/getPlatformLocales';
import { MainNavBar } from '../MainNavBar';

export default function MainMenu({ subNavWidth, ...props }) {
  const session = useSession();
  if (session) session.isSuperAdmin = currentProfileIsSuperAdmin();
  if (session) session.isAdmin = currentProfileIsAdmin();

  const [t] = useTranslateLoader(prefixPN('sessionMenu'));
  const [ts] = useTranslateLoader(prefixPN('spotlight'));
  const [store, render] = useStore({
    onlyOneProfile: false,
    isLoading: false,
  });

  const [loadMenu, setLoadMenu] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const sessionId = React.useRef(session?.id);
  const forceReload = React.useRef(false);

  const deploymentConfig = useDeploymentConfig({ ignoreVersion: true });
  const userConfig = useMemo(() => {
    let config;
    if (deploymentConfig) {
      Object.keys(deploymentConfig).forEach((key) => {
        if (key.includes('.users')) {
          config = deploymentConfig[key];
        }
      });
    }
    return config;
  }, [deploymentConfig]);

  const reloadMenu = () => {
    setLoadMenu(true);
  };

  // ························································
  // LOAD INITIAL DATA

  /**
   * Asynchronously loads initial data required for the menu.
   * It fetches user centers, profiles, and the platform name concurrently.
   * Then, it filters out denied profiles based on the deployment configuration.
   * If there's only one center with less than two profiles and less than two profiles in total,
   * it sets the store to indicate there's only one profile available.
   */
  async function load() {
    // Fetch user centers, profiles, and platform name concurrently
    const [{ centers }, { profiles }, { name }, { locales }] = await Promise.all([
      getUserCentersRequest(),
      getUserProfilesRequest(),
      getPlatformName(),
      getPlatformLocales(),
    ]);

    if (locales.length > 1) {
      store.hasManyLocales = true;
    }

    // Retrieve denied profiles from deployment configuration
    const deniedProfiles = userConfig?.deny?.profiles || [];

    // Filter centers to exclude denied profiles
    const filteredCenters = centers.map((center) => ({
      ...center,
      profiles: center.profiles.filter((profile) => !deniedProfiles.includes(profile.sysName)),
    }));
    // Filter profiles to exclude denied profiles
    const filteredProfiles = profiles.filter(
      (profile) => !deniedProfiles.includes(profile.sysName)
    );

    // Store the platform name in the store
    store.platformName = name;

    if (filteredCenters.length < 2) {
      store.centerName = filteredCenters[0]?.name;
    } else {
      store.centerName = store.platformName;
    }

    // Check if there's only one profile available and update the store accordingly
    if (
      filteredCenters.length < 2 &&
      (!filteredCenters[0]?.profiles || filteredCenters[0]?.profiles.length < 2) &&
      filteredProfiles.length < 2
    ) {
      store.onlyOneProfile = true;
    }
    // Trigger a re-render
    render();
  }

  SocketIoService.useOn('USER_CHANGE_LOCALE', () => {
    forceReload.current = true;
    reloadMenu();
  });

  // ························································
  // EFFECTS

  useEffect(() => {
    hooks.addAction('menu-builder:reload-menu', reloadMenu);
    return () => {
      hooks.removeAction('menu-builder:reload-menu', reloadMenu);
    };
  });

  useEffect(() => {
    if (userConfig !== undefined) load();
  }, [userConfig]);

  useEffect(() => {
    setLoadMenu(true);
  }, []);

  useEffect(() => {
    // ES: Reiniciamos el menu cuando cambia el id de la sesion
    // EN: Reset the menu when the session id changes
    if (sessionId.current !== session?.id) {
      forceReload.current = true;
      setMenuData([]);
      reloadMenu();
      sessionId.current = session?.id;
    }
  }, [session]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (loadMenu) {
          store.isLoading = true;
          render();
          const menu = await getMenu('menu-builder.main', forceReload.current);
          if (mounted) {
            setMenuData(menu);
            store.isLoading = false;
            render();
            setLoadMenu(false);
            forceReload.current = false;
          }
        }
      } catch (error) {
        //
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadMenu]);

  const navTitle = store.centerName ? store.centerName : store.platformName;

  const sessionMenuData = React.useMemo(() => {
    const result = [];
    if (!session?.isSuperAdmin) {
      result.push({
        id: 'menu-0',
        label: t('accountInfo'),
        order: 0,
        url: '/private/users/detail',
        window: 'SELF',
        disabled: null,
      });
    }

    result.push({
      id: 'menu-1',
      label: t('emailPreference'),
      order: 1,
      url: '/private/emails/preference',
      window: 'SELF',
      disabled: null,
    });

    if (store.hasManyLocales) {
      result.push({
        id: 'menu-2',
        label: t('changeLanguage'),
        order: 2,
        url: '/private/users/language',
        window: 'SELF',
        disabled: null,
      });
    }

    if (!store.onlyOneProfile) {
      result.push({
        id: 'menu-3',
        label: t('switchProfile'),
        order: 3,
        url: '/protected/users/select-profile',
        window: 'NEW',
        disabled: null,
      });
    }

    if (deploymentConfig?.helpdeskUrl) {
      result.push({
        id: 'menu-helpdesk',
        label: t('helpdesk'),
        order: 4,
        url: deploymentConfig?.helpdeskUrl,
        window: 'BLANK',
        disabled: null,
      });
    }

    result.push({
      id: 'menu-5',
      label: t('logout'),
      order: 5,
      url: '/protected/users/logout',
      window: 'NEW',
      disabled: null,
    });

    return result;
  }, [t, store.hasManyLocales, deploymentConfig?.helpdeskUrl, store.onlyOneProfile, session]);

  if (!session) return null;

  return (
    <Spotlight
      data={menuData}
      useRouter
      searchPlaceholder={ts('searchPlaceholder')}
      nothingFoundMessage={ts('nothingFoundMessage')}
      limit={10}
    >
      <MainNavBar
        {...props}
        menuData={menuData}
        isLoading={store.isLoading}
        subNavWidth={subNavWidth}
        hideSubNavOnClose={false}
        useRouter
        useSpotlight={!session?.isSuperAdmin}
        spotlightLabel={ts('tooltip')}
        navTitle={navTitle}
        session={{
          ...session,
          name: session?.name ?? '',
          surnames: session?.surnames ?? '',
          avatar: session.avatar,
        }}
        sessionMenu={{
          id: 'menu-0',
          label: t('label'),
          children: sessionMenuData,
        }}
      />
    </Spotlight>
  );
}

MainMenu.propTypes = {
  subNavWidth: PropTypes.number,
};
