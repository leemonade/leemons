import { useState, useEffect } from 'react';
import { Drawer, useDrawer, Button } from 'leemons-ui';
import { XIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';
import { getDefaultPlatformLocaleRequest, getPlatformLocalesRequest } from '@users/request';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import TranslateIcon from './translateIcon';
import Tabs from './tabs';
import useAsync from '../../../hooks/request/useAsync';

export function useTranslationsDrawer(config = {}) {
  const [drawer, toggleDrawer] = useDrawer({ size: 'right', ...config, overlayClose: false });
  const [warnings, _setWarnings] = useState({});
  const [_locales] = useAsync(getPlatformLocalesRequest);
  const [_defaultLocale] = useAsync(getDefaultPlatformLocaleRequest);

  const locales = _locales?.locales;
  const defaultLocale = _defaultLocale?.locale;

  // If reload arg is provided, replace the whole state by the new one
  // (missing locales will be set to the default value)
  const setWarnings = ({ reload, ...value }) =>
    _setWarnings((oldValue) => {
      if (reload) {
        return value;
      }

      return { ...oldValue, ...value };
    });

  // Ensure all the tabs have a warning state
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
            [code]:
              warnings && warnings[code] !== undefined
                ? warnings[code]
                : config?.warningDefault || false,
          }),
          {}
        )
      );
    }
  }, [warnings, locales]);

  return {
    drawer,
    toggleDrawer,
    warnings,
    setWarnings,
    warningDefault: config?.warningDefault || false,
    locales,
    defaultLocale,
  };
}

export function TranslationsDrawer({
  drawer,
  warnings,
  setWarnings,
  warningDefault,
  children,
  locales,
  defaultLocale,

  onSave,
  onCancel,
}) {
  const [translations] = useTranslate({ keysStartsWith: 'plugins.classroom.translationsDrawer' });
  const t = tLoader('plugins.classroom.translationsDrawer', translations);

  return (
    <Drawer {...drawer}>
      <div className="p-6 max-w-sm relative">
        <Button
          className="btn-circle btn-xs ml-8 bg-transparent border-0 absolute top-1 right-1"
          onClick={onCancel}
        >
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
        <section>
          <TranslateIcon />
          <h2 className="text-secondary text-xl">{t('title')}</h2>
          <Tabs
            panel={children}
            warnings={warnings}
            setWarnings={setWarnings}
            warningDefault={warningDefault}
            locales={locales}
            defaultLocale={defaultLocale}
          />
          <div className="flex justify-between my-16">
            <Button color="primary" className="btn-link" onClick={onCancel}>
              {t('actions.cancel')}
            </Button>
            <Button color="primary" onClick={onSave}>
              {t('actions.save')}
            </Button>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
TranslationsDrawer.propTypes = {
  drawer: PropTypes.object,
  toggleDrawer: PropTypes.func,
  warnings: PropTypes.object,
  setWarnings: PropTypes.func,
  warningDefault: PropTypes.bool,
  children: PropTypes.element,
  locales: PropTypes.arrayOf(PropTypes.object),
  defaultLocale: PropTypes.string,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
