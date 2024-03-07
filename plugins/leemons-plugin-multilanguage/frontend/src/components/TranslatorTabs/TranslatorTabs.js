import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { findIndex, forEach, isArray, isFunction, isNil, isString } from 'lodash';
import { Tabs, TabPanel } from '@bubbles-ui/components';
import { RatingStarIcon as StarIcon } from '@bubbles-ui/icons/solid';

export const TRANSLATOR_TABS_DEFAULT_PROPS = {
  locales: [],
  errors: [],
  warnings: [],
  defaultLocale: null,
};
export const TRANSLATOR_TABS_PROP_TYPES = {
  children: PropTypes.element,
  locales: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, code: PropTypes.string, config: PropTypes.any })
  ),
  // Array of locale codes
  errors: PropTypes.arrayOf(PropTypes.string),
  // Array of locale codes
  warnings: PropTypes.arrayOf(PropTypes.string),
  // Default Locale code
  defaultLocale: PropTypes.string,
  onLocaleChange: PropTypes.func,
};

const TranslatorTabs = ({ children, locales, errors, warnings, defaultLocale, onLocaleChange }) => {
  const [langs, setLangs] = useState([]);
  const [configs, setConfigs] = useState({});

  const getConfig = (_locales, i) => ({
    currentLocaleIndex: i,
    currentLocale: _locales[i],
    currentLocaleIsDefaultLocale: _locales[i].code === defaultLocale,
    defaultLocale,
    locales: _locales,
  });

  const getAllConfigs = (_locales) => {
    const result = {};
    forEach(_locales, (locale, i) => {
      result[locale.code] = getConfig(_locales, i);
    });
    return result;
  };

  useEffect(() => {
    if (isArray(locales) && isString(defaultLocale)) {
      const data = [...locales];
      const langIndex = findIndex(locales, { code: defaultLocale });
      if (langIndex > -1) {
        data.unshift(...data.splice(langIndex, 1));
        setLangs(data);
        setConfigs(getAllConfigs(data));
      }
    }
  }, [locales, defaultLocale]);

  const handleLocaleChange = (code) => {
    code = code.replace('.$', '');
    if (isFunction(onLocaleChange)) onLocaleChange(configs[code]);
  };

  return isArray(langs) && langs.length > 0 ? (
    <Tabs forceRender onTabClick={handleLocaleChange}>
      {langs.map((locale, i) => (
        <TabPanel
          key={locale.code}
          label={locale.label}
          hasError={errors.includes(locale.code)}
          hasWarning={warnings.includes(locale.code)}
          rightIcon={
            defaultLocale === locale.code ? (
              <StarIcon style={{ width: 14, color: '#B9BEC4' }} />
            ) : null
          }
        >
          {!isNil(children) && React.isValidElement(children)
            ? React.cloneElement(children, { localeConfig: configs[locale.code] })
            : null}
        </TabPanel>
      ))}
    </Tabs>
  ) : null;
};

TranslatorTabs.defaultProps = TRANSLATOR_TABS_DEFAULT_PROPS;
TranslatorTabs.propTypes = TRANSLATOR_TABS_PROP_TYPES;

export { TranslatorTabs };
