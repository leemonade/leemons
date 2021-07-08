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

const menuWidth = '52px';

export default function MainMenu({ onClose, onOpen }) {
  const session = useSession();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState({ parent: null, child: null });
  const [menu, setMenu] = useState([]);

  function openMenu() {
    if (onOpen) onOpen(activeMenu);
  }

  async function loadMenu() {
    const _menu = await getMenu('plugins.menu-builder.main');
    setMenu(_menu);
  }

  const handleRouteChange = async () => {
    const result = await getActiveParentAndChild();
    setActiveMenu(result);
    if (result.parent) openMenu();
  };

  useEffect(() => {}, [activeMenu]);

  useEffect(() => {
    (async () => {
      await loadMenu();
      await handleRouteChange();
    })();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  function onMenuItemClick(item) {
    setActiveMenu({ ...activeMenu, parent: item });
    openMenu();
  }

  async function onCloseSubMenu() {
    setActiveMenu(await getActiveParentAndChild());
    if (onClose) onClose();
  }

  return (
    <>
      <div className="flex w-full">
        {/* Menu */}
        <div style={{ width: menuWidth }} className="h-screen flex-none bg-gray-100">
          <div className="h-screen w-full flex flex-col justify-between bg-gray-100">
            <img className="w-8 mb-9 mx-auto" src="/menu-builder/logo.svg" alt="" />

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
                      className="rounded-full bg-blue-500 mx-auto my-4 text-white font-lexend text-center flex flex-col align-items-center justify-center"
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
