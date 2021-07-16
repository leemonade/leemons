import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  InboxInIcon,
  LightningBoltIcon,
  CodeIcon,
  ColorSwatchIcon,
  AdjustmentsIcon,
  SparklesIcon,
  AtSymbolIcon,
} from '@heroicons/react/outline';
import { Menu, MenuItem } from '../src/components/ui';

function Sidebar({ children }) {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [menuItems, setMenuItems] = useState({});

  useEffect(() => {
    fetch('/api/menu')
      .then((data) => data.json())
      .then((data) => setMenuItems(data));
  }, []);

  return (
    <div data-theme="light">
      <div className="drawer drawer-mobile">
        <input
          id="main-menu"
          type="checkbox"
          className="drawer-toggle"
          checked={showMainMenu}
          onChange={() => setShowMainMenu(!showMainMenu)}
        />
        <main className="flex-grow block overflow-x-hidden bg-base-100 text-base-content drawer-content">
          <div className="p-4 lg:p-10">{children}</div>
        </main>
        <div className="drawer-side">
          <label htmlFor="main-menu" className="drawer-overlay"></label>
          <aside className="flex flex-col border-r border-base-200 bg-base-100 text-base-content w-80">
            <div className="hidden lg:block sticky inset-x-0 top-0 z-50 w-full border-b border-base-200 transition duration-200 ease-in-out bg-base-100 py-1">
              <div className="mx-auto space-x-1 navbar max-w-none">
                <div className="flex items-center flex-none">
                  <Link
                    href="/"
                    className="px-2 flex-0 btn btn-ghost md:px-4"
                    aria-label="Homepage"
                  >
                    <div className="inline-block text-3xl font-title text-base-content font-semibold">
                      <span className="lowercase text-secondary">leemons</span>
                      <span className="text-secondary-200">ui</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <Menu className="flex flex-col p-4 pt-2 compact">
                <MenuItem className="mt-4 menu-title">
                  <span>Docs</span>
                </MenuItem>
                <MenuItem>
                  <Link href="/install">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <InboxInIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      install
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/use">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <LightningBoltIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      use
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/customize">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <CodeIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      customize components
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/default-themes">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <SparklesIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      Themes
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/config">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <AdjustmentsIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      config
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/colors">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <ColorSwatchIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      Colors
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/layout">
                    <a onClick={() => setShowMainMenu(false)} className="capitalize">
                      <AtSymbolIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
                      Layout &amp; Typography
                    </a>
                  </Link>
                </MenuItem>
              </Menu>
              <Menu className="flex flex-col p-4 pt-0 compact">
                <MenuItem className="menu-title">
                  <span>Components</span>
                </MenuItem>

                {Array.isArray(menuItems.components) &&
                  menuItems.components.map((item, index) => (
                    <MenuItem key={`c-${index}`}>
                      <Link href={item.url}>
                        <a className="capitalize justify-between">{item.label}</a>
                      </Link>
                    </MenuItem>
                  ))}

                <MenuItem className="mt-4 menu-title">
                  <span>Demos</span>
                </MenuItem>

                {Array.isArray(menuItems.demos) &&
                  menuItems.demos.map((item, index) => (
                    <MenuItem key={`d-${index}`}>
                      <Link href={item.url}>
                        <a className="capitalize justify-between">{item.label}</a>
                      </Link>
                    </MenuItem>
                  ))}
              </Menu>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.any,
};

export default Sidebar;
