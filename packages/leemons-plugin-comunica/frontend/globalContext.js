import { NotificationProvider } from '@bubbles-ui/notifications';
import { useStore } from '@common';
import ContextButton from '@comunica/components/ContextButton';
import RoomService from '@comunica/RoomService';
import SocketIoService from '@mqtt-socket-io/service';
import { getCentersWithToken, useSession } from '@users/session';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';

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

  async function load() {
    if (!store.config) {
      const { enabled } = await RoomService.getGeneralConfig();
      store.enabled = enabled;
      render();
    }
  }

  function onShowDrawerChange(showDrawer) {
    store.showDrawer = showDrawer;
    render();
  }

  React.useEffect(() => {
    const old = store.showButton;
    store.showButton = false;
    if (session) {
      load();
    } else {
      store.config = null;
    }
    if (
      session &&
      centers &&
      centers.length &&
      location.pathname !== '/private/users/select-profile' &&
      store.enabled
    ) {
      store.showButton = true;
    }
    if (old !== store.showButton) {
      render();
    }
  }, [session, location, store.enabled]);

  SocketIoService.useOnAny((event, data) => {
    if (event === 'COMUNICA:CONFIG:GENERAL') {
      store.enabled = data.enabled;
      render();
    }
  });

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
