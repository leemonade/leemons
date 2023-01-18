import React from 'react';
import PropTypes from 'prop-types';
import ContextButton from '@comunica/components/ContextButton';
import { useStore } from '@common';
import { useLocation } from 'react-router-dom';
import { getCentersWithToken, useSession } from '@users/session';

export function Provider({ children }) {
  const [store, render] = useStore({ showButton: false });
  const session = useSession();
  const centers = getCentersWithToken();
  const location = useLocation();

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
      {store.showButton ? <ContextButton /> : null}
      {children}
    </>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};
