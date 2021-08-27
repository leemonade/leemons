import * as _ from 'lodash';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getMenu } from '@menu-builder/helpers';
import PropTypes from 'prop-types';
import getActiveParentAndChild from '../../helpers/getActiveParentAndChild';
import MainMenuItem from './mainMenuItem';
import MainMenuSubmenu from './mainMenuSubmenu';
import { useSession } from '@users/session';
import hooks from 'leemons-hooks';
import SimpleBar from 'simplebar-react';

const menuWidth = '52px';

export default function MainMenu({ onClose, onOpen, state, setState }) {
  const session = useSession();
  const router = useRouter();

  const loadMenu = useCallback(async () => {
    const menu = await getMenu('plugins.menu-builder.main');
    setState({ menu });
    return menu;
  }, [state]);

  async function reloadMenu() {
    const _menu = await loadMenu();
    if (state.menuActive && state.menuActive.parent) {
      const parent = _.find(_menu, { id: state.menuActive.parent.id });
      if (parent) setState({ menuActive: { ...state.menuActive, parent } });
    }
  }

  const openMenu = useCallback(() => {
    if (onOpen) onOpen();
  }, [state]);

  const closeMenu = useCallback(() => {
    if (onClose) onClose();
  }, [state]);

  const handleRouteChange = useCallback(async () => {
    const menuActive = await getActiveParentAndChild();
    if (state.menuActive && state.menuActive.parent && !menuActive.parent) {
      menuActive.parent = state.menuActive.parent;
    }
    setState({ menuActive });
    if (menuActive.parent) {
      openMenu();
    } else {
      closeMenu();
    }
    return menuActive;
  }, [state]);

  const onMenuItemClick = useCallback(
    (parent) => {
      setState({ menuActive: { ...state.menuActive, parent } });
      openMenu();
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

  return (
    <>
      <div className="flex w-full">
        {/* Menu */}
        <div style={{ width: menuWidth }} className="h-screen flex-none bg-secondary">
          <div className="h-screen w-full flex flex-col justify-between">
            <img className="w-6 mb-9 mx-auto" src="/assets/logo.svg" alt="" />

            {/* Menu items */}
            <SimpleBar className="flex-grow h-px">
              {state.menu && state.menuActive
                ? state.menu.map((item) => (
                    <MainMenuItem
                      onClick={() => onMenuItemClick(item)}
                      key={item.id}
                      active={state.menuActive.parent?.id === item.id}
                      item={item}
                      menuWidth={menuWidth}
                    />
                  ))
                : null}
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
