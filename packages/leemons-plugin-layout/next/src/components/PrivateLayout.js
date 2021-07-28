import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DndLayer from '@menu-builder/components/dnd/dndLayer';
import MainMenu from '@menu-builder/components/mainMenu';

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
    setState({ menuWidth: 52 });
  }, [state]);

  const onOpenMenu = useCallback(() => {
    setState({ menuWidth: 242 });
  }, [state]);

  return (
    <>
      <div className={'flex'}>
        <DndLayer />
        <div
          style={{ width: `${state.menuWidth}px` }}
          className={'overflow-x-visible transition-all'}
        >
          <MainMenu state={state} setState={setState} onClose={onCloseMenu} onOpen={onOpenMenu} />
        </div>
        <div className="w-full bg-secondary-content">{children}</div>
      </div>
    </>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
  persistentState: PropTypes.any,
};

export default PrivateLayout;
