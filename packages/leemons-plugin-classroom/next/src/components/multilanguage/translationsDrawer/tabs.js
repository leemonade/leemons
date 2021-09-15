import { useMemo, cloneElement } from 'react';
import { Tabs as UITabs, Tab, TabList, TabPanel } from 'leemons-ui';
import { StarIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';

export default function Tabs({ panel, warnings, locales, defaultLocale }) {
  const TabsHeaders = useMemo(
    () =>
      locales?.map(({ code, name }) => (
        <Tab key={code} id={`tab-${code}`} panelId={`panel-${code}`}>
          {code === defaultLocale ? (
            <StarIcon className="inline-block w-4 h-4 stroke-current mr-3" />
          ) : (
            ''
          )}
          {name}
          {warnings[code] ? (
            <ExclamationCircleIcon className={`w-3 h-3 ml-2 relative -top-1 text-error`} />
          ) : (
            ''
          )}
        </Tab>
      )),
    [locales, defaultLocale, warnings]
  );

  const TabsPanels = useMemo(
    () =>
      locales?.map(({ code }) => (
        <TabPanel key={code} id={`panel-${code}`} tabId={`tab-${code}`}>
          {panel ? cloneElement(panel, { locale: code, isDefault: code === defaultLocale }) : false}
        </TabPanel>
      )),
    [panel, locales, defaultLocale]
  );

  if (!locales?.length || !defaultLocale) {
    return <></>;
  }

  return (
    <div>
      <UITabs>
        <div className="mb-6 overflow-x-auto">
          <TabList>{TabsHeaders}</TabList>
        </div>
        {TabsPanels}
      </UITabs>
    </div>
  );
}

Tabs.propTypes = {
  panel: PropTypes.element,
  warnings: PropTypes.object,
  setWarnings: PropTypes.func,
  warningDefault: PropTypes.bool,
  locales: PropTypes.arrayOf(PropTypes.object),
  defaultLocale: PropTypes.string,
};
