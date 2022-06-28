import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import { getMenu } from '@menu-builder/helpers';
import { MainNav } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@menu-builder/helpers/prefixPN';
import SocketIoService from '@socket-io/service';

export default function MainMenu({ subNavWidth, ...props }) {
  const session = useSession();
  const [t] = useTranslateLoader(prefixPN('sessionMenu'));
  const [isLoading, setIsLoading] = useState(false);
  const [loadMenu, setLoadMenu] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const sessionId = React.useRef(session?.id);
  const forceReload = React.useRef(false);

  const reloadMenu = () => {
    setLoadMenu(true);
  };

  SocketIoService.useOn('USER_CHANGE_LOCALE', () => {
    forceReload.current = true;
    reloadMenu();
  });

  useEffect(() => {
    hooks.addAction('menu-builder:reload-menu', reloadMenu);
    return () => {
      hooks.removeAction('menu-builder:reload-menu', reloadMenu);
    };
  });

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
      if (loadMenu) {
        setIsLoading(true);
        const menu = await getMenu('plugins.menu-builder.main', forceReload.current);
        if (mounted) {
          setMenuData(menu);
          setIsLoading(false);
          setLoadMenu(false);
          forceReload.current = false;
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadMenu]);

  if (!session) return null;

  return (
    <MainNav
      {...props}
      menuData={menuData}
      isLoading={isLoading}
      subNavWidth={subNavWidth}
      hideSubNavOnClose={false}
      useRouter={true}
      session={{
        ...session,
        ...(session.isSuperAdmin
          ? { name: '', surnames: '' }
          : { name: session.name, surnames: session.surnames }),
      }}
      sessionMenu={{
        id: 'menu-0',
        label: t('label'),
        children: [
          ...(session.isSuperAdmin
            ? []
            : [
                {
                  id: 'menu-1',
                  label: t('accountInfo'),
                  order: 0,
                  url: '/private/users/detail',
                  window: 'SELF',
                  disabled: null,
                },
                {
                  id: 'menu-2',
                  label: t('switchProfile'),
                  order: 1,
                  url: '/private/users/select-profile',
                  window: 'SELF',
                  disabled: null,
                },
              ]),
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
            label: t('logout'),
            order: 2,
            url: '/private/users/logout',
            window: 'SELF',
            disabled: null,
          },
        ],
      }}
    />
  );
}

MainMenu.propTypes = {
  subNavWidth: PropTypes.number,
};
