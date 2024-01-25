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
import React, { useEffect, useState } from 'react';
import getPlatformName from '@users/request/getPlatformName';
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

  const reloadMenu = () => {
    setLoadMenu(true);
  };

  // ························································
  // LOAD INITIAT DATA

  async function load() {
    const [{ centers }, { profiles }, { name }] = await Promise.all([
      getUserCentersRequest(),
      getUserProfilesRequest(),
      getPlatformName(),
    ]);
    store.platformName = name;
    if (centers.length === 1 && centers[0].profiles.length === 1 && profiles.length === 1) {
      store.onlyOneProfile = true;
      store.centerName = centers[0].name;
      render();
    }
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
    load();
  }, []);

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

  const navTitle = session?.isSuperAdmin ? 'Leemons' : store.centerName;

  const sessionMenuData = React.useMemo(() => {
    const result = [];
    if (!session?.isSuperAdmin) {
      result.push({
        id: 'menu-1',
        label: t('accountInfo'),
        order: 0,
        url: '/private/users/detail',
        window: 'SELF',
        disabled: null,
      });
    }

    if (!store.onlyOneProfile) {
      result.push({
        id: 'menu-2',
        label: t('switchProfile'),
        order: 1,
        url: '/protected/users/select-profile',
        window: 'BLANK',
        disabled: null,
      });
    }

    result.push(
      {
        id: 'menu-3',
        label: t('changeLanguage'),
        order: 2,
        url: '/private/users/language',
        window: 'SELF',
        disabled: null,
      },
      {
        id: 'menu-4',
        label: t('emailPreference'),
        order: 3,
        url: '/private/emails/preference',
        window: 'SELF',
        disabled: null,
      },
      {
        id: 'menu-5',
        label: t('logout'),
        order: 4,
        url: '/protected/users/logout',
        window: 'BLANK',
        disabled: null,
      }
    );

    return result;
  }, [t, store, session]);

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
        navTitle={session.isAdmin ? store.platformName : navTitle}
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
