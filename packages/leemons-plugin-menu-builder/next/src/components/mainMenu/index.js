import * as _ from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getMenu } from '@menu-builder/helpers';
import PropTypes from 'prop-types';
import getActiveParentAndChild from '../../helpers/getActiveParentAndChild';
import MainMenuItem from './mainMenuItem';
import MainMenuSubmenu from './mainMenuSubmenu';
import hooks from 'leemons-hooks';
import SimpleBar from 'simplebar-react';
import Link from 'next/link';
import { UserImage } from '@common/userImage';

const menuWidth = '52px';

export default function MainMenu({ onClose, onOpen, state: _state, setState }) {
  const loadingMenu = useRef();
  const stateC = useRef();
  stateC.current = _state;
  const state = stateC.current;

  const router = useRouter();

  const loadMenu = useCallback(async () => {
    const menu = await getMenu('plugins.menu-builder.main');
    setState({ menu });
    return menu;
  }, [state]);

  async function reloadMenu() {
    loadingMenu.current = true;
    const _menu = await loadMenu();
    if (state.menuActive && state.menuActive.parent) {
      const parent = _.find(_menu, { id: state.menuActive.parent.id });
      if (parent) setState({ menuActive: { ...state.menuActive, parent } });
    }
    loadingMenu.current = false;
  }

  const openMenu = useCallback(() => {
    if (onOpen) onOpen();
  }, [state]);

  const closeMenu = useCallback(() => {
    if (onClose) onClose();
  }, [state]);

  const handleRouteChange = useCallback(async () => {
    if (loadingMenu.current) {
      setTimeout(() => {
        handleRouteChange();
      }, 100);
    } else {
      const menuActive = await getActiveParentAndChild();
      if (stateC.current.menuActive && stateC.current.menuActive.parent && !menuActive.parent) {
        menuActive.parent = stateC.current.menuActive.parent;
      }
      setState({ menuActive });
      if (menuActive.parent) {
        if (!menuActive.parent.url) {
          openMenu();
        }
      } else {
        closeMenu();
      }
      return menuActive;
    }
  }, [state]);

  const onMenuItemClick = useCallback(
    (parent) => {
      setState({ menuActive: { ...state.menuActive, parent } });

      let openSubMenu = true;
      let closeSubMenu = false;
      if (parent.url) {
        openSubMenu = false;
        closeSubMenu = true;
      }
      if (closeSubMenu) {
        closeMenu();
      }
      if (openSubMenu) {
        openMenu();
      }
    },
    [state]
  );

  async function onCloseSubMenu() {
    setState({ menuActive: await getActiveParentAndChild() });
    closeMenu();
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

  const getItem = (item) => {
    if (item.url) {
      return (
        <Link key={item.id} href={item.url}>
          <a>
            <MainMenuItem
              onClick={() => onMenuItemClick(item)}
              active={state.menuActive.parent?.id === item.id}
              item={item}
              menuWidth={menuWidth}
            />
          </a>
        </Link>
      );
    } else {
      return (
        <MainMenuItem
          onClick={() => onMenuItemClick(item)}
          key={item.id}
          active={state.menuActive.parent?.id === item.id}
          item={item}
          menuWidth={menuWidth}
        />
      );
    }
  };

  return (
    <>
      <div className="flex w-full">
        {/* Menu */}
        <div style={{ width: menuWidth }} className="h-screen flex-none bg-secondary">
          <div className="h-screen w-full flex flex-col justify-between">
            <img className="w-6 mb-9 mx-auto" src="/assets/logo.svg" alt="" />

            {/* Menu items */}
            <SimpleBar className="flex-grow h-px">
              {state.menu && state.menuActive ? state.menu.map((item) => getItem(item)) : null}
            </SimpleBar>

            {/* User image */}
            <div>
              <UserImage className="mx-auto my-4" />
            </div>
          </div>
        </div>

        {/* Submenu */}
        {state.menuActive ? (
          <MainMenuSubmenu
            item={state.menuActive.parent}
            activeItem={state.menuActive.child}
            onClose={onCloseSubMenu}
            state={state}
            setState={setState}
          />
        ) : null}
      </div>
    </>
  );
}

MainMenu.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};
