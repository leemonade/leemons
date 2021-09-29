import React from 'react';
import {
  PageHeader,
  Drawer,
  useDrawer,
  FormControl,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  Input,
  Button,
  Checkbox,
} from 'leemons-ui';
import { PlusCircleIcon } from '@heroicons/react/outline';
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  XIcon,
  StarIcon,
} from '@heroicons/react/solid';

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

function PageHeaderPage() {
  const [drawer, toggleDrawer] = useDrawer({
    animated: true,
    side: 'right',
  });
  return (
    <>
      <div className="bg-secondary-content  edit-mode w-full h-screen overflow-auto grid">
        <div className="bg-primary-content w-full">
          <PageHeader separator={false} title="Tree" className="pb-0"></PageHeader>
          <p className="page-description text-secondary pb-12 max-w-screen-xl w-full mx-auto px-6">
            Use the button{' '}
            <PlusCircleIcon alt="add button" className={`w-5 h-5 inline text-primary `} /> to create
            a new level, the use the config area to configure the data set for the level
          </p>
        </div>
        <div className="flex max-w-screen-xl w-full mx-auto px-6">
          {/* Dummy tree */}
          <div className="tree_editWrapper flex-1 my-2 mb-2">
            <ul className="tree" role="list">
              <li className="" role="listitem" draggable="true">
                <div className="tree-node relative flex items-center h-8 rounded group bg-white hover:bg-gray-10 cursor-pointer pr-2">
                  <div className="flex items-center justify-center group cursor-pointer transition-transform transform ease-linear h-6 w-8 rotate-0">
                    <svg
                      className="text-gray-300 group-hover:text-secondary"
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.2805 5.43C4.29449 5.44755 4.30952 5.46425 4.32551 5.48C4.50458 5.65892 4.74736 5.75943 5.00051 5.75943C5.25365 5.75943 5.49643 5.65892 5.67551 5.48C5.69149 5.46425 5.70652 5.44755 5.72051 5.43L9.2 0.7615C9.25274 0.690532 9.28471 0.606304 9.29235 0.51822C9.29999 0.430135 9.283 0.34166 9.24327 0.262672C9.20355 0.183685 9.14265 0.117293 9.06737 0.0709094C8.9921 0.0245258 8.90542 -2.42472e-05 8.81701 1.79704e-08H1.18551C1.09709 -2.42472e-05 1.01041 0.0245258 0.935135 0.0709094C0.859863 0.117293 0.798964 0.183685 0.759237 0.262672C0.71951 0.34166 0.702518 0.430135 0.710159 0.51822C0.717799 0.606304 0.749771 0.690532 0.802505 0.7615L4.2805 5.43Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-1 text-sm text-gray-300 group-hover:text-secondary">
                    <span>Organization/center</span>
                  </div>
                </div>

                <ul className="" role="list">
                  <li className="" role="listitem" draggable="true">
                    <div className="tree-node relative flex items-center h-8 rounded group transition-all ease-out transform opacity-100">
                      <div className="flex-1 pr-1">
                        <button className="btn  btn-primary btn-sm w-full mb-1  btn-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-primary w-4 h-4 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <div className="flex-1 text-left">Add level (to organization)</div>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* End Dummy tree */}
          <div className="flex-1 my-2 mb-2 bg-primary-content py-6 pl-12 pr-6">
            <FormControl>
              <div className="flex space-x-2 mb-4">
                <Input outlined className="inpu w-full" name="levelName" placeholder="Level name" />
                <button className="btn  btn-primary">Save level and continue</button>
              </div>
            </FormControl>
            <FormControl
              className="mb-12 px-4"
              label={
                <>
                  Class Level{' '}
                  <span className="fc_legend">
                    <InformationCircleIcon className={`w-5 h-5 inline mx-2 text-gray-30`} />
                    Minimum level of student assignment
                  </span>
                </>
              }
              labelPosition="right"
            >
              <Checkbox color="primary" />
            </FormControl>
            <div>
              <Button color="primary" link className="pr-1 btn-link" onClick={toggleDrawer}>
                Translations
              </Button>
              <span className="fc_legend">
                <ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />
                Untranslated content will appear in the default language
              </span>
            </div>
            <Tabs>
              <TabList>
                <Tab tabIndex="0" id="Tab1" panelId="Panel1">
                  Extra data
                </Tab>
                <Tab tabIndex="0" id="Tab2" panelId="Panel2">
                  Permissions
                </Tab>
              </TabList>
              <TabPanel id="Panel1" tabId="Tab1" className="p-4">
                <h2>Any content 1</h2>
              </TabPanel>
              <TabPanel id="Panel2" tabId="Tab2" className="p-4">
                <h2>Any content 2</h2>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
      <Drawer {...drawer}>
        <div className="p-6 max-w-sm relative">
          <Button
            className="btn-circle btn-xs ml-8 bg-transparent border-0 absolute top-1 right-1"
            onClick={toggleDrawer}
          >
            <XIcon className="inline-block w-4 h-4 stroke-current" />
          </Button>
          <section>
            {/* TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M5 8.75V5.75C5 5.35218 5.15804 4.97064 5.43934 4.68934C5.72064 4.40804 6.10218 4.25 6.5 4.25C6.89782 4.25 7.27936 4.40804 7.56066 4.68934C7.84196 4.97064 8 5.35218 8 5.75V8.75"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 7.25H8"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 11V12.5"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 12.5H20"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 12.5C18.5 12.5 17 17 14 17"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 15.2666C17.3345 15.7654 17.7788 16.1809 18.2988 16.4813C18.8189 16.7817 19.4008 16.959 20 16.9996"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.75 19.25C11.3522 19.25 10.9706 19.092 10.6893 18.8107C10.408 18.5294 10.25 18.1478 10.25 17.75V10.25C10.25 9.85218 10.408 9.47064 10.6893 9.18934C10.9706 8.90804 11.3522 8.75 11.75 8.75H22.25C22.6478 8.75 23.0294 8.90804 23.3107 9.18934C23.592 9.47064 23.75 9.85218 23.75 10.25V17.75C23.75 18.1478 23.592 18.5294 23.3107 18.8107C23.0294 19.092 22.6478 19.25 22.25 19.25H20.75V23.75L16.25 19.25H11.75Z"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.25 13.25L4.25 16.25V11.75H2.75C2.35218 11.75 1.97064 11.592 1.68934 11.3107C1.40804 11.0294 1.25 10.6478 1.25 10.25V2.75C1.25 2.35218 1.40804 1.97064 1.68934 1.68934C1.97064 1.40804 2.35218 1.25 2.75 1.25H13.25C13.6478 1.25 14.0294 1.40804 14.3107 1.68934C14.592 1.97064 14.75 2.35218 14.75 2.75V5.75"
                  stroke="#8E97A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
                </clipPath>
              </defs>
            </svg>
            <h2 className="text-secondary text-xl">Level translation</h2>
            <Tabs>
              <TabList>
                <Tab tabIndex="0" id="Tab1" panelId="Panel1">
                  <StarIcon className="inline-block w-4 h-4 stroke-current mr-3" /> Spanish
                </Tab>
                <Tab tabIndex="0" id="Tab2" panelId="Panel2">
                  English
                </Tab>
                <Tab tabIndex="0" id="Tab2" panelId="Panel2">
                  French{' '}
                  <ExclamationCircleIcon className={`w-3 h-3 ml-2 relative -top-1 text-error`} />
                </Tab>
              </TabList>
              <TabPanel id="Panel1"></TabPanel>
            </Tabs>
            <div className="flex justify-between my-16">
              <Button color="primary" className="btn-link">
                Cancel{' '}
              </Button>
              <Button color="primary">Save</Button>
            </div>
          </section>
        </div>
      </Drawer>
    </>
  );
}

export default PageHeaderPage;
