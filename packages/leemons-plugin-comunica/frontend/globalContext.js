import React from 'react';
import PropTypes from 'prop-types';
import ContextButton from '@comunica/components/ContextButton';
import { useStore } from '@common';
import { useLocation } from 'react-router-dom';
import { getCentersWithToken, useSession } from '@users/session';
import { NotificationProvider } from '@bubbles-ui/notifications';

const notificationProps = {
  autoClose: 8000,
  transitionDuration: 250,
  containerWidth: 440,
  notificationMaxHeight: 200,
  limit: 5,
  zIndex: 1,
  xOffset: 100,
  type: 'chat',
};

export function Provider({ children }) {
  const [store, render] = useStore({ showButton: false });
  const session = useSession();
  const centers = getCentersWithToken();
  const location = useLocation();

  function onShowDrawerChange(showDrawer) {
    store.showDrawer = showDrawer;
    render();
  }

  React.useEffect(() => {
    const old = store.showButton;
    store.showButton = false;
    if (session && centers && location.pathname !== '/private/users/select-profile') {
      store.showButton = true;
    }
    if (old !== store.showButton) {
      render();
    }
  }, [session, location]);

  return (
    <>
      <NotificationProvider {...notificationProps} xOffset={store.showDrawer ? 420 : 100}>
        {store.showButton ? <ContextButton onShowDrawerChange={onShowDrawerChange} /> : null}
      </NotificationProvider>
      {children}
    </>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};
