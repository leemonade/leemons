import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const mainRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handler = () => {
      mainRef.current.scrollTo(0, 0);
    };
    router.events.on('routeChangeComplete', handler);

    return () => {
      router.events.off('routerChangeComplete', handler);
    };
  }, []);

  return (
    <div>
      <div className="drawer drawer-mobile">
        <input
          id="main-menu"
          type="checkbox"
          className="drawer-toggle"
          checked={showMainMenu}
          onChange={() => setShowMainMenu(!showMainMenu)}
        />
        <main
          ref={mainRef}
          className="flex-grow block overflow-x-hidden bg-base-100 text-base-content drawer-content"
        >
          <div className="p-4 lg:p-10">{children}</div>
        </main>
        <Sidebar setShowMainMenu={setShowMainMenu} showMainMenu={showMainMenu} />
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
