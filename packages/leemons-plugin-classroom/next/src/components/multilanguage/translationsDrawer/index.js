// import React, { useMemo, useEffect, useState } from 'react';
import { useState } from 'react';
import { Drawer, useDrawer, Button } from 'leemons-ui';
// import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
// import { Tabs, Tab, TabList, TabPanel, useDrawer, Drawer, Button } from 'leemons-ui';
import { XIcon, StarIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import TranslateIcon from './translateIcon';
import Tabs from './tabs';
// import useAsync from '../../hooks/request/useAsync';

export function useTranslationsDrawer(config = {}) {
  const [drawer, toggleDrawer] = useDrawer({ size: 'right', ...config });
  const [warnings, setWarnings] = useState({});
  return {
    drawer,
    toggleDrawer,
    warnings,
    setWarnings,
    warningDefault: config?.warningDefault || false,
  };
}

export function TranslationsDrawer({
  drawer,
  toggleDrawer: toggleTranslations,
  warnings,
  setWarnings,
  warningDefault,
}) {
  return (
    <Drawer {...drawer}>
      <div className="p-6 max-w-sm relative">
        <Button
          className="btn-circle btn-xs ml-8 bg-transparent border-0 absolute top-1 right-1"
          onClick={toggleTranslations}
        >
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
        <section>
          <TranslateIcon />
          <h2 className="text-secondary text-xl">Level translation</h2>
          <Tabs warnings={warnings} setWarnings={setWarnings} warningDefault={warningDefault} />
          {/* <Tabs>
            <div className="w-full overflow-x-scroll">
              <TabList>{TabHeaders}</TabList>
            </div>
            <div className="mt-6">{Children}</div>
          </Tabs> */}
          <div className="flex justify-between my-16">
            <Button color="primary" className="btn-link" onClick={toggleTranslations}>
              Cancel
            </Button>
            <Button color="primary" onClick={toggleTranslations}>
              Save
            </Button>
          </div>
        </section>
      </div>
    </Drawer>
  );
}

// import React, { useMemo, useEffect, useState } from 'react';
// import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
// import { Tabs, Tab, TabList, TabPanel, useDrawer, Drawer, Button } from 'leemons-ui';
// import { XIcon, StarIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
// import useAsync from '../../hooks/request/useAsync';

// function _TranslationsTabs(locales, defaultLocale, warnings, registerToggler = () => {}) {
//   // eslint-disable-next-line react/display-name
//   return ({ children }) => {
//     const [drawer, toggleTranslations] = useDrawer({
//       animated: true,
//       side: 'right',
//     });

//     useEffect(() => {
//       registerToggler(toggleTranslations);
//     }, []);

//     if (!locales?.length || !defaultLocale) {
//       return <></>;
//     }
//     const TabHeaders = useMemo(
//       () =>
//         locales.map(({ code, name }) => (
//           <Tab key={code} id={`tab-${code}`} panelId={`panel-${code}`}>
//             {code === defaultLocale ? (
//               <StarIcon className="inline-block w-4 h-4 stroke-current mr-3" />
//             ) : (
//               ''
//             )}
//             {name}
//             {warnings[code] ? (
//               <ExclamationCircleIcon className={`w-3 h-3 ml-2 relative -top-1 text-error`} />
//             ) : (
//               ''
//             )}
//           </Tab>
//         )),
//       [locales, defaultLocale]
//     );

//     const Children = useMemo(
//       () =>
//         locales.map(({ code }) => (
//           <TabPanel key={code} id={`panel-${code}`} tabId={`tab-${code}`}>
//             {children
//               ? React.cloneElement(children, { locale: code, isDefault: code === defaultLocale })
//               : false}
//           </TabPanel>
//         )),
//       [children, locales, defaultLocale]
//     );

//     return (
//       <Drawer {...drawer}>
//         <div className="p-6 max-w-sm relative">
//           <Button
//             className="btn-circle btn-xs ml-8 bg-transparent border-0 absolute top-1 right-1"
//             onClick={toggleTranslations}
//           >
//             <XIcon className="inline-block w-4 h-4 stroke-current" />
//           </Button>
//           <section>
//             {/* TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
//             <svg
//               width="25"
//               height="25"
//               viewBox="0 0 25 25"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g clipPath="url(#clip0)">
//                 <path
//                   d="M5 8.75V5.75C5 5.35218 5.15804 4.97064 5.43934 4.68934C5.72064 4.40804 6.10218 4.25 6.5 4.25C6.89782 4.25 7.27936 4.40804 7.56066 4.68934C7.84196 4.97064 8 5.35218 8 5.75V8.75"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M5 7.25H8"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M17 11V12.5"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M14 12.5H20"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M18.5 12.5C18.5 12.5 17 17 14 17"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M17 15.2666C17.3345 15.7654 17.7788 16.1809 18.2988 16.4813C18.8189 16.7817 19.4008 16.959 20 16.9996"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M11.75 19.25C11.3522 19.25 10.9706 19.092 10.6893 18.8107C10.408 18.5294 10.25 18.1478 10.25 17.75V10.25C10.25 9.85218 10.408 9.47064 10.6893 9.18934C10.9706 8.90804 11.3522 8.75 11.75 8.75H22.25C22.6478 8.75 23.0294 8.90804 23.3107 9.18934C23.592 9.47064 23.75 9.85218 23.75 10.25V17.75C23.75 18.1478 23.592 18.5294 23.3107 18.8107C23.0294 19.092 22.6478 19.25 22.25 19.25H20.75V23.75L16.25 19.25H11.75Z"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M7.25 13.25L4.25 16.25V11.75H2.75C2.35218 11.75 1.97064 11.592 1.68934 11.3107C1.40804 11.0294 1.25 10.6478 1.25 10.25V2.75C1.25 2.35218 1.40804 1.97064 1.68934 1.68934C1.97064 1.40804 2.35218 1.25 2.75 1.25H13.25C13.6478 1.25 14.0294 1.40804 14.3107 1.68934C14.592 1.97064 14.75 2.35218 14.75 2.75V5.75"
//                   stroke="#8E97A3"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </g>
//               <defs>
//                 <clipPath id="clip0">
//                   <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
//                 </clipPath>
//               </defs>
//             </svg>
//             <h2 className="text-secondary text-xl">Level translation</h2>
//             <Tabs>
//               <div className="w-full overflow-x-scroll">
//                 <TabList>{TabHeaders}</TabList>
//               </div>
//               <div className="mt-6">{Children}</div>
//             </Tabs>
//             <div className="flex justify-between my-16">
//               <Button color="primary" className="btn-link" onClick={toggleTranslations}>
//                 Cancel
//               </Button>
//               <Button color="primary" onClick={toggleTranslations}>
//                 Save
//               </Button>
//             </div>
//           </section>
//         </div>
//       </Drawer>
//     );
//   };
// }

// function useTranslationsTabs({ warningDefault = false } = {}) {
//   const [locales, , localesError, localesLoading] = useAsync(getPlatformLocalesRequest);
//   const [defaultLocale, , defaultLocaleError, defaultLocaleLoading] = useAsync(
//     getDefaultPlatformLocaleRequest
//   );
//   const [warnings, setWarnings] = useState({});

//   const [toggleTranslations, setToggleTranslations] = useState({ toggleTranslations: () => {} });

//   const TranslationsTabs = useMemo(
//     () =>
//       _TranslationsTabs(locales?.locales, defaultLocale?.locale, warnings, (_toggleTranslations) =>
//         setToggleTranslations({ toggleTranslations: _toggleTranslations })
//       ),
//     [locales?.locales, defaultLocale?.locale]
//   );

//   useEffect(() => {
//     if (
//       locales?.locales.length &&
//       Object.keys(warnings).sort().join(', ') !==
//         locales.locales
//           .map(({ code }) => code)
//           .sort()
//           .join(', ')
//     ) {
//       setWarnings(
//         locales?.locales.reduce(
//           (obj, { code }) => ({
//             ...obj,
//             [code]: warnings && warnings[code] ? warnings[code] : warningDefault,
//           }),
//           {}
//         )
//       );
//     }
//   }, [warnings, locales]);

//   return {
//     locales: locales?.locales,
//     defaultLocale: defaultLocale?.locale,
//     loading: localesLoading || defaultLocaleLoading,
//     error: localesError?.message || defaultLocaleError?.message,
//     toggleTranslations: toggleTranslations.toggleTranslations,
//     setWarnings,
//     warnings,
//     TranslationsTabs,
//   };
// }

// export default useTranslationsTabs;
