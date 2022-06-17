import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import { getMenu } from '@menu-builder/helpers';
import { MainNav } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@menu-builder/helpers/prefixPN';

export default function MainMenu({ subNavWidth, ...props }) {
  const session = useSession();
  const [t] = useTranslateLoader(prefixPN('sessionMenu'));
  const [isLoading, setIsLoading] = useState(false);
  const [loadMenu, setLoadMenu] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const reloadMenu = () => {
    setLoadMenu(true);
  };

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
    let mounted = true;
    (async () => {
      if (loadMenu) {
        setIsLoading(true);
        const menu = await getMenu('plugins.menu-builder.main');
        if (mounted) {
          setMenuData(menu);
          setIsLoading(false);
          setLoadMenu(false);
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
      session={{ ...session, name: session.isSuperAdmin ? '' : session.name }}
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
