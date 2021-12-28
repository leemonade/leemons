import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import _ from 'lodash';
import { getMenu } from '@menu-builder/helpers';
import { Avatar, MainNav, MAIN_NAV_WIDTH } from '@bubbles-ui/components';

export default function MainMenu({ onClose, onOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const loadMenu = async () => {
    const menu = await getMenu('plugins.menu-builder.main');
    setMenuData(menu);
    return menu;
  };

   const reloadMenu = async () => {
    setIsLoading(true);
    await loadMenu();
    setIsLoading(false);
  };

  useEffect(() => {
    hooks.addAction('menu-builder:reload-menu', reloadMenu);
    return () => {
      hooks.removeAction('menu-builder:reload-menu', reloadMenu);
    };
  });

  useEffect(async () => {
    await loadMenu();
  }, []);

  return (
    <MainNav menuData={menuData} onOpen={onOpen} onClose={onClose} isLoading={isLoading} />
  );
}

MainMenu.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};
