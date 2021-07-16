import * as _ from 'lodash';
import SimpleBar from 'simplebar-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMenu } from '@menu-builder/helpers';
import PropTypes from 'prop-types';
import getActiveParentAndChild from '../../helpers/getActiveParentAndChild';
import MainMenuItem from './mainMenuItem';
import MainMenuSubmenu from './mainMenuSubmenu';
import { useSession } from '@users/session';
import hooks from 'leemons-hooks';

const menuWidth = '52px';

export default function MainMenu({ onClose, onOpen }) {
  const session = useSession();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState({ parent: null, child: null });
  const [menu, setMenu] = useState([]);

  async function loadMenu() {
    const _menu = await getMenu('plugins.menu-builder.main');
    setMenu(_menu);
    return _menu;
  }

  async function reloadMenu() {
    const _menu = await loadMenu();
    if (activeMenu.parent) {
      const parent = _.find(_menu, { id: activeMenu.parent.id });
      if (parent) setActiveMenu({ ...activeMenu, parent });
    }
  }

  function openMenu() {
    if (onOpen) onOpen(activeMenu);
  }

  const handleRouteChange = async () => {
    const result = await getActiveParentAndChild();
    setActiveMenu(result);
    if (result.parent) openMenu();
  };

  function onMenuItemClick(item) {
    setActiveMenu({ ...activeMenu, parent: item });
    openMenu();
  }

  async function onCloseSubMenu() {
    setActiveMenu(await getActiveParentAndChild());
    if (onClose) onClose();
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    hooks.addAction('menu-builder:reload-menu', reloadMenu);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      hooks.removeAction('menu-builder:reload-menu', reloadMenu);
    };
  });

  useEffect(() => {
    (async () => {
      await loadMenu();
      await handleRouteChange();
    })();
  }, []);

  return (
    <>
      <div className="flex w-full">
        {/* Menu */}
        <div style={{ width: menuWidth }} className="h-screen flex-none bg-secondary">
          <div className="h-screen w-full flex flex-col justify-between">
            <img className="w-6 mb-9 mx-auto" src="/menu-builder/logo.svg" alt="" />

            {/* Menu items */}
            <SimpleBar className="flex-grow h-px">
              {menu.map((item) => (
                <MainMenuItem
                  onClick={() => onMenuItemClick(item)}
                  key={item.id}
                  active={activeMenu.parent?.id === item.id}
                  item={item}
                  menuWidth={menuWidth}
                />
              ))}
            </SimpleBar>

            {/* User image */}
            <div>
              {session && (
                <>
                  {session.image ? (
                    <Image width={40} height={40} src={session.image} className="rounded-full" />
                  ) : (
                    <div
                      style={{ width: '40px', height: '40px' }}
                      className="rounded-full bg-primary-focus mx-auto my-4 text-secondary-content font-lexend text-center flex flex-col align-items-center justify-center"
                    >
                      {session.name[0].toUpperCase()}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submenu */}
        <MainMenuSubmenu
          item={activeMenu.parent}
          activeItem={activeMenu.child}
          onClose={onCloseSubMenu}
        />
      </div>
    </>
  );
}

MainMenu.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};
