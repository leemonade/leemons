import React from 'react';
import { Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Drawer, { useDrawer } from '../../src/components/ui/Drawer';
import { Button } from '../../src';
import Wrapper from '../../src/components/Wrapper';

const data = {
  showType: true,
  components: [
    { class: 'drawer', desc: 'Container element' },
    { class: 'drawer-toggle', desc: 'For checkbox element that controls the drawer' },
    { class: 'drawer-content', desc: 'The content container' },
    { class: 'drawer-side', desc: 'The sidebar container' },
    { class: 'drawer-overlay', desc: 'The label covers the content when drawer is open' },
  ],
  utilities: [
    {
      class: 'drawer-mobile',
      desc: 'Makes drawer to open/close on mobile but will be always visible on desktop',
    },
    { class: 'drawer-end', desc: 'puts drawer to the right' },
  ],
};

function DrawerPage() {
  const [drawer, toggleDrawer] = useDrawer({
    animated: true,
    side: 'right',
  });

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Drawer</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="sliding drawer menu" classes="flex flex-col space-y-2">
          <Button color="primary" onClick={toggleDrawer}>
            Open
          </Button>
          <Drawer {...drawer}>Flipas</Drawer>
        </Wrapper>
        {/*
        <Wrapper title="sliding drawer menu" classes="flex flex-col space-y-2">
          <div className="drawer rounded border border-base-200 bg-base-200 h-52">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="flex flex-col items-center justify-center drawer-content">
              <label className="btn btn-primary drawer-button" htmlFor="my-drawer">
                open menu
              </label>
            </div>
            <div className="drawer-side">
              <label className="drawer-overlay" htmlFor="my-drawer"></label>
              <Menu className="p-4 overflow-y-auto w-80 bg-base-100">
                <MenuItem className="text-secondary">
                  <a>Menu Item</a>
                </MenuItem>
                <MenuItem>
                  <a>Menu Item</a>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Wrapper>

        <Wrapper title="sliding drawer for mobile only" classes="flex flex-col space-y-2">
          <div className="rounded border border-base-200 bg-base-200 drawer drawer-mobile h-52">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="flex flex-col items-center justify-center drawer-content">
              <label className="mb-4 btn btn-primary drawer-button lg:hidden" htmlFor="my-drawer-2">
                open menu
              </label>
              <div className="hidden text-xs text-center lg:block">
                Menu is always open on desktop size.
                <br />
                Resize the browser to see toggle button on mobile size
              </div>
              <div className="text-xs text-center lg:hidden">
                Menu can be toggled on mobile size.
                <br />
                Resize the browser to see fixed sidebar on desktop size
              </div>
            </div>
            <div className="drawer-side">
              <label className="drawer-overlay" htmlFor="my-drawer-2"></label>
              <Menu className="p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                <MenuItem>
                  <a>Menu Item</a>
                </MenuItem>
                <MenuItem>
                  <a>Menu Item</a>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Wrapper>

        <Wrapper
          title="navbar menu for desktop + drawer for mobile"
          classes="flex flex-col space-y-2"
        >
          <div className="rounded border border-base-200 bg-base-200 drawer h-52">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="flex flex-col drawer-content">
              <div className="w-full navbar bg-primary">
                <div className="flex-none lg:hidden">
                  <label htmlFor="my-drawer-3" className="btn btn-square btn-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-6 h-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
                <div className="flex-1 px-2 mx-2 text-primary-content">
                  <span>Change screen size to show/hide menu</span>
                </div>
                <div className="flex-none hidden lg:block">
                  <Menu horizontal>
                    <MenuItem color="white">
                      <a>Item 1</a>
                    </MenuItem>
                    <MenuItem color="white">
                      <a>Item 2</a>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
              <Menu className="p-4 overflow-y-auto w-80 bg-base-100">
                <MenuItem>
                  <a>Item 1</a>
                </MenuItem>
                <MenuItem>
                  <a>Item 2</a>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Wrapper>

        <Wrapper title="drawer-end" classes="flex flex-col space-y-2">
          <div className="drawer drawer-end rounded border border-base-200 bg-base-200 h-52">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="flex flex-col items-center justify-center drawer-content">
              <label className="btn btn-primary drawer-button" htmlFor="my-drawer-4">
                open menu
              </label>
            </div>
            <div className="drawer-side">
              <label className="drawer-overlay" htmlFor="my-drawer-4"></label>
              <Menu className="p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                <MenuItem>
                  <a>Menu Item</a>
                </MenuItem>
                <MenuItem>
                  <a>Menu Item</a>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Wrapper>
        */}

        <Divider className="my-6" />

        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default DrawerPage;
