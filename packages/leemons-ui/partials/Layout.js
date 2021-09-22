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
    <div className="flex h-screen overflow-hidden">
      {/*
        <input
          id="main-menu"
          type="checkbox"
          className="drawer-toggle"
          checked={showMainMenu}
          onChange={() => setShowMainMenu(!showMainMenu)}
        />
        */}
      <Sidebar setShowMainMenu={setShowMainMenu} showMainMenu={showMainMenu} />
      <main
        ref={mainRef}
        className="flex-1 block overflow-x-hidden h-screen overflow-y-auto bg-base-100 text-base-content drawer-content"
      >
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
