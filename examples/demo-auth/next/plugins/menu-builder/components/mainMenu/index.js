import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMenu } from '@menu-builder/helpers';
import PropTypes from 'prop-types';
import getActiveParentAndChild from '../../helpers/getActiveParentAndChild';
import MainMenuItem from './mainMenuItem';
import MainMenuSubmenu from './mainMenuSubmenu';

const menuWidth = '52px';

export default function MainMenu({ onClose, onOpen }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState({ parent: null, child: null });
  const [menu, setMenu] = useState([]);

  async function loadMenu() {
    const _menu = await getMenu('plugins.menu-builder.main');
    console.log(_menu);
    setMenu(_menu);
  }

  const handleRouteChange = async () => {
    setActiveMenu(await getActiveParentAndChild());
  };

  useEffect(() => {
    if (onOpen && activeMenu.parent) onOpen(activeMenu);
  }, [activeMenu]);

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
  }

  return (
    <>
      <div className="flex w-full">
        {/* Menu */}

        <div style={{ width: menuWidth }} className="h-screen flex-none bg-gray-100">
          <img className="w-8 mb-9 mx-auto" src="/menu-builder/logo.svg" alt="" />

          {menu.map((item) => (
            <MainMenuItem
              onClick={() => onMenuItemClick(item)}
              key={item.id}
              active={activeMenu.parent?.id === item.id}
              item={item}
              menuWidth={menuWidth}
            />
          ))}
        </div>

        {/* Submenu */}
        <MainMenuSubmenu item={activeMenu.parent} activeItem={activeMenu.child} onClose={onClose} />
      </div>
    </>
  );
}

MainMenu.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};
