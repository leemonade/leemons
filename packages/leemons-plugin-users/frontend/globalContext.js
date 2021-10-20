import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { SessionProvider, SessionContext } from '@users/context/session';

export function Provider({ children }) {
  useEffect(() => {}, []);

  return <SessionProvider>{children}</SessionProvider>;
}

Provider.propTypes = {
  children: PropTypes.element,
};

export default SessionContext;
