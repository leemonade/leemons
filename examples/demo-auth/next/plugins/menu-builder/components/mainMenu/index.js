import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import { getMenu } from '@menu-builder/helpers';
import { MainNav } from '@bubbles-ui/components';

export default function MainMenu({ onClose, onOpen, subNavWidth }) {
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

  return (
    <MainNav
      menuData={menuData}
      onOpen={onOpen}
      onClose={onClose}
      isLoading={isLoading}
      subNavWidth={subNavWidth}
      hideSubNavOnClose={false}
      useRouter={true}
    />
  );
}

MainMenu.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  subNavWidth: PropTypes.number,
};
