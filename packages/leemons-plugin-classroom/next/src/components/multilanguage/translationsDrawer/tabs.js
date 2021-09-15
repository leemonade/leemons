import { useMemo, useEffect, cloneElement } from 'react';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import { Tabs as UITabs, Tab, TabList, TabPanel } from 'leemons-ui';
import { StarIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import useAsync from '../../../hooks/request/useAsync';

export default function Tabs({ panel, warnings, setWarnings, warningDefault }) {
  const [_locales, , localesError, localesLoading] = useAsync(getPlatformLocalesRequest);
  const [_defaultLocale, , defaultLocaleError, defaultLocaleLoading] = useAsync(
    getDefaultPlatformLocaleRequest
  );

  const locales = _locales?.locales;
  const defaultLocale = _defaultLocale?.locale;

  useEffect(() => {
    if (
      locales?.length &&
      Object.keys(warnings).sort().join(', ') !==
        locales
          .map(({ code }) => code)
          .sort()
          .join(', ')
    ) {
      setWarnings(
        locales?.reduce(
          (obj, { code }) => ({
            ...obj,
            [code]: warnings && warnings[code] ? warnings[code] : warningDefault,
          }),
          {}
        )
      );
    }
  }, [warnings, locales]);

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
    [locales, defaultLocale]
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
        <TabList>{TabsHeaders}</TabList>
        {TabsPanels}
      </UITabs>

      <p>Default Locale: {defaultLocale}</p>
    </div>
  );
}
