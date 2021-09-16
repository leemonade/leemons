import React, { useEffect, useState } from 'react';
import { Input } from 'leemons-ui';
import PropTypes from 'prop-types';
import { TranslationsDrawer } from '../../../multilanguage/translationsDrawer';
import useGetNames from '../../../../hooks/levelschema/useGetNames';

function TranslationTab({
  locale,
  isDefault,
  warnings,
  setWarnings,
  defaultLocaleValues,
  setDefaultLocaleValues,
  values,
  setValues,
}) {
  // Use the main value if it is the default locale, if not, use global values
  const value = isDefault ? defaultLocaleValues : values[locale];

  // Set tab warning when an empty field is present
  useEffect(() => {
    if (value?.name && value?.name.length) {
      if (warnings[locale]) setWarnings({ [locale]: false });
    } else if (!warnings[locale]) {
      setWarnings({ [locale]: true });
    }
  }, [value]);
  return (
    <>
      <Input
        outlined
        className="input w-full"
        placeholder="Level name"
        value={value?.name || ''}
        onChange={(e) => {
          // Also update the default value (seen outside translations)
          if (isDefault) {
            setDefaultLocaleValues({ ...value, name: e.target.value });
          }
          setValues({ [locale]: { ...value, name: e.target.value } });
        }}
      />
    </>
  );
}

TranslationTab.propTypes = {
  locale: PropTypes.string,
  isDefault: PropTypes.bool,
  warnings: PropTypes.object,
  setWarnings: PropTypes.func,
  defaultLocaleValues: PropTypes.object,
  setDefaultLocaleValues: PropTypes.func,
  values: PropTypes.object,
  setValues: PropTypes.func,
};

export default function Translations({
  defaultLocaleValues,
  setDefaultLocaleValues,
  localizations,
  onSave = () => {},
  onCancel = () => {},
  entityId,
  ...props
}) {
  const [names] = useGetNames(entityId);
  const { warnings, setWarnings, toggleDrawer, drawer, defaultLocale } = props;

  // Save the previous main values, so it can be restored onCancel
  const [originalDefaultValue, setOriginalDefaultValue] = useState({});
  const [values, _setValues] = useState({});
  const setValues = ({ reload = false, ...newValue }) => {
    if (reload) {
      _setValues(newValue);
    } else {
      _setValues((oldValue) => ({ ...oldValue, ...newValue }));
    }
    const _warnings = Object.entries(newValue).reduce((obj, [locale, value]) => {
      if (value?.name && value?.name.length) {
        if (reload || warnings[locale] !== false) {
          return { ...obj, [locale]: false };
        }
      } else if (reload || warnings[locale] !== true) {
        return { ...obj, [locale]: true };
      }
      return obj;
    }, {});
    if (reload) {
      setWarnings({ reload: true, ..._warnings });
    } else if (Object.keys(_warnings).length) {
      setWarnings(_warnings);
    }
  };

  // Update translations to the new entity values
  useEffect(() => {
    // Prevents showing previous translations on slow connections
    if (names && names.id === entityId && names.names) {
      const newValues = names.names.reduce(
        (obj, { locale, value }) => ({ ...obj, [locale]: { name: value } }),
        {}
      );
      setValues({
        reload: true,
        ...newValues,
      });
      setDefaultLocaleValues({
        ...defaultLocaleValues,
        name: newValues[defaultLocale]?.name || '',
      });
    }
  }, [names]);

  // Update translations to the previous localization
  useEffect(() => {
    if (names) {
      setValues(localizations);
    }
  }, [localizations]);

  // Update the previous main value when is changed and the Drawer is closed
  useEffect(() => {
    if (!drawer.isShown) {
      setOriginalDefaultValue(defaultLocaleValues);
    }
  }, [defaultLocaleValues]);

  const handleSave = () => {
    onSave(values);
    toggleDrawer();
  };

  const handleCancel = () => {
    // Set the rest of the values to the DB' value and if present, the previous
    // modified values (last save localizations but not level)
    setValues({
      reload: true,
      ...names.names.reduce(
        (obj, { locale, value }) => ({ ...obj, [locale]: { name: value } }),
        {}
      ),
      ...localizations,
    });
    // restore the original value
    setDefaultLocaleValues(originalDefaultValue);
    onCancel();
    toggleDrawer();
  };

  return (
    <TranslationsDrawer {...props} onSave={handleSave} onCancel={handleCancel}>
      <TranslationTab
        warnings={warnings}
        setWarnings={setWarnings}
        defaultLocaleValues={defaultLocaleValues}
        setDefaultLocaleValues={setDefaultLocaleValues}
        values={values}
        setValues={setValues}
      />
    </TranslationsDrawer>
  );
}
Translations.propTypes = {
  defaultLocaleValues: PropTypes.object,
  setDefaultLocaleValues: PropTypes.func,
  defaultLocale: PropTypes.string,
  localizations: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  entityId: PropTypes.string,
  warnings: PropTypes.object,
  setWarnings: PropTypes.func,
  toggleDrawer: PropTypes.func,
  drawer: PropTypes.object,
};
