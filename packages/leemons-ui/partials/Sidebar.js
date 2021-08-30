import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  InboxInIcon,
  LightningBoltIcon,
  ColorSwatchIcon,
  AdjustmentsIcon,
  SparklesIcon,
  AtSymbolIcon,
} from '@heroicons/react/outline';
import { Menu, MenuItem } from '../src/components/ui';

const DOCS_ITEMS = [
  { label: 'Install', url: '/install', icon: InboxInIcon },
  { label: 'Use', url: '/use', icon: LightningBoltIcon },
  { label: 'Config', url: '/config', icon: AdjustmentsIcon },
  { label: 'Themes', url: '/themes', icon: SparklesIcon },
  { label: 'Colors', url: '/colors', icon: ColorSwatchIcon },
  { label: 'Layout & Typography', url: '/layout', icon: AtSymbolIcon },
];

function Sidebar({ setShowMainMenu }) {
  const [menuItems, setMenuItems] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/menu')
      .then((data) => data.json())
      .then((data) => setMenuItems(data));
  }, []);

  return (
    <div className="drawer-side bg-secondary h-screen overflow-y-auto">
      <label htmlFor="main-menu" className="drawer-overlay"></label>
      <aside className="flex flex-col border-r border-base-200 bg-secondary text-secondary-content w-80">
        <div className="hidden lg:block sticky inset-x-0 top-0 z-50 w-full border-b border-secondary-400 transition duration-200 ease-in-out bg-secondary py-1">
          <div className="mx-auto space-x-1 navbar max-w-none">
            <div className="flex items-center flex-none">
              <Link href="/">
                <a className="px-2 flex-0" aria-label="Homepage">
                  <div className="flex text-4xl font-title text-base-content font-medium">
                    <img src="/images/logo.svg" className="inline-block" />
                    <div className="ml-1">
                      <span className="lowercase text-white">leemons</span>
                      <span className="text-accent">ui</span>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <Menu compact className="flex flex-col p-4 pt-2">
            <MenuItem className="mt-4 menu-title">
              <span>Docs</span>
            </MenuItem>

            {DOCS_ITEMS.map((item, index) => (
              <MenuItem
                key={`d-${index}`}
                color="white"
                className={
                  router.pathname === item.url ? 'menu-item-active btn-primary btn-active' : ''
                }
              >
                <Link href={item.url}>
                  <a onClick={() => setShowMainMenu(false)} className="capitalize">
                    {<item.icon className="inline-block w-6 h-6 mr-2 stroke-current" />}
                    {item.label}
                  </a>
                </Link>
              </MenuItem>
            ))}
          </Menu>
          <Menu compact className="flex flex-col p-4 pt-0">
            <MenuItem className="menu-title">
              <span>Components</span>
            </MenuItem>

            {Array.isArray(menuItems.components) &&
              menuItems.components.map((item, index) => (
                <MenuItem
                  key={`c-${index}`}
                  color="white"
                  className={
                    router.pathname === item.url ? 'menu-item-active btn-primary btn-active' : ''
                  }
                >
                  <Link href={item.url}>
                    <a className="capitalize justify-between">{item.label}</a>
                  </Link>
                </MenuItem>
              ))}

            <MenuItem className="mt-4 menu-title">
              <span>Blocks</span>
            </MenuItem>

            {Array.isArray(menuItems.demos) &&
              menuItems.blocks.map((item, index) => (
                <MenuItem
                  key={`d-${index}`}
                  color="white"
                  className={
                    router.pathname === item.url ? 'menu-item-active btn-primary btn-active' : ''
                  }
                >
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
                <MenuItem
                  key={`d-${index}`}
                  color="white"
                  className={
                    router.pathname === item.url ? 'menu-item-active btn-primary btn-active' : ''
                  }
                >
                  <Link href={item.url}>
                    <a className="capitalize justify-between">{item.label}</a>
                  </Link>
                </MenuItem>
              ))}
          </Menu>
        </div>
      </aside>
    </div>
  );
}

Sidebar.propTypes = {
  setShowMainMenu: PropTypes.func,
  showMainMenu: PropTypes.bool,
};

export default Sidebar;
