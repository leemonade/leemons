// TODO: Add translations from the saved object itself
// TODO: Update the warnings onCancel and on EntityUpdate
import React, { useEffect, useState } from 'react';
import { Input } from 'leemons-ui';
import PropTypes from 'prop-types';
import { TranslationsDrawer } from '../../../multilanguage/translationsDrawer';

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
          setValues((_value) => ({ ..._value, [locale]: { ...value, name: e.target.value } }));
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
  onSave = () => {},
  onCancel = () => {},
  ...props
}) {
  const { warnings, setWarnings, toggleDrawer, drawer } = props;

  // Save the previous main values, so it can be restored onCancel
  const [originalDefaultValue, setOriginalDefaultValue] = useState({});
  const [values, setValues] = useState({});

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
    // Clear all the values
    setValues({});
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
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  warnings: PropTypes.object,
  setWarnings: PropTypes.func,
  toggleDrawer: PropTypes.func,
  drawer: PropTypes.object,
};
