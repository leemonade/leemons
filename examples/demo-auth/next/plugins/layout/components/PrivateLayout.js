import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DndLayer from '@menu-builder/components/dnd/dndLayer';
import MainMenu from '@menu-builder/components/mainMenu';
import Alert from './Alert';

function PrivateLayout({ persistentState: [state, _setState], children }) {
  const store = useRef({});

  const setState = ({ ...rest }) => {
    store.current = { ...store.current, ...rest };
    _setState(store.current);
  };

  useEffect(() => {
    if (!state.menuWidth) {
      setState({ menuWidth: 52 });
    }
  }, []);

  const onCloseMenu = useCallback(() => {
    if (state.menuWidth !== 52) setState({ menuWidth: 52 });
  }, [state]);

  const onOpenMenu = useCallback(() => {
    if (state.menuWidth !== 280) setState({ menuWidth: 280 });
  }, [state]);

  return (
    <>
      <div className={'flex h-screen'}>
        <DndLayer />
        <div
          style={{ width: `${state.menuWidth}px` }}
          className={'overflow-x-visible transition-all h-full'}
        >
          <MainMenu
            state={store.current}
            setState={setState}
            onClose={onCloseMenu}
            onOpen={onOpenMenu}
          />
        </div>
        <div className="w-full bg-secondary-content h-screen overflow-y-auto">
          <Alert />
          {children}
        </div>
      </div>
    </>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
  persistentState: PropTypes.any,
};

export default PrivateLayout;
