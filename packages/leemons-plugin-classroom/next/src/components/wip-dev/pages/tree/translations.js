import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import FormControl from 'leemons-ui/dist/components/ui/FormControl';
import { TranslationsDrawer } from '../../../multilanguage/translationsDrawer';
import useGetNames from '../../../../hooks/levelschema/useGetNames';
import useDirtyState from '../../../../hooks/useDirtyState';
import ExitWithoutSaving from './exitWithoutSaving';

function TranslationTab({
  defaultLocaleValues,
  isDefault,
  locale,
  setDefaultLocaleValues,
  setValues,
  setWarnings,
  values,
  warnings,
}) {
  const [translations] = useTranslate({ keysStartsWith: 'plugins.classroom.editor.form.name' });
  const t = tLoader('plugins.classroom.editor.form.name', translations);
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
      <FormControl className="fc w-full my-4 flex flex-row" label={t('placeholder')}>
        <Input
          outlined
          className="inline-block flex-1 w-1/2"
          placeholder={t('placeholder')}
          value={value?.name || ''}
          onChange={(e) => {
            // Also update the default value (seen outside translations)
            if (isDefault) {
              setDefaultLocaleValues({ ...value, name: e.target.value });
            }
            setValues({ [locale]: { ...value, name: e.target.value } });
          }}
        />
      </FormControl>
    </>
  );
}

TranslationTab.propTypes = {
  defaultLocaleValues: PropTypes.object,
  isDefault: PropTypes.bool,
  locale: PropTypes.string,
  setDefaultLocaleValues: PropTypes.func,
  setValues: PropTypes.func,
  setWarnings: PropTypes.func,
  values: PropTypes.object,
  warnings: PropTypes.object,
};

export default function Translations({
  locale: userLocale,

  entityId,
  setTreeEntity,

  defaultLocaleValues,
  setDefaultLocaleValues,

  localizations,

  onCancel = () => {},
  onSave = () => {},
  ...props
}) {
  const [names] = useGetNames(entityId);
  const { warnings, setWarnings, toggleDrawer, drawer, defaultLocale } = props;

  // Save the previous main values, so it can be restored onCancel
  const [prevDefaultLocaleValue, setPrevDefaultLocaleValue] = useState({});
  const {
    // The localizations that editLevel have (and will get saved)
    defaultValue: dirtyDefaultValue,
    setDefaultValue: dirtySetDefaultValue,
    // The currently edited values (will get discarted if not saved)
    value: dirtyValue,
    setValue: dirtySetValue,
    // Whether if the values were modified or not
    isDirty,
  } = useDirtyState({});
  const [showSaveWithouSaving, setShowSaveWithouSaving] = useState(false);

  // Handle localization value change
  const setValues = ({ reload = false, ...newValue }) => {
    if (reload) {
      // Replace the values by the new ones
      dirtySetValue(newValue);
    } else {
      // Add the new value to the values object
      dirtySetValue((oldValue) => ({ ...oldValue, ...newValue }));
    }
    // Check which warnings should be setted
    const _warnings = Object.entries(newValue).reduce((obj, [locale, value]) => {
      if (locale !== defaultLocale && locale === userLocale) {
        // Update the Tree Entity name if the current locale is selected by
        // the user but not by the platform (as this case is already handled)
        setTreeEntity({ name: value.name });
      }
      // Get the empty localization warnings
      if (value?.name && value?.name.length) {
        if (reload || warnings[locale] !== false) {
          return { ...obj, [locale]: false };
        }
      } else if (reload || warnings[locale] !== true) {
        return { ...obj, [locale]: true };
      }
      return obj;
    }, {});

    // Save the warnings if needed
    if (reload) {
      setWarnings({ reload: true, ..._warnings });
    } else if (Object.keys(_warnings).length) {
      setWarnings(_warnings);
    }
  };

  // When the currently edited entity changes, update the display values
  useEffect(() => {
    // Prevents showing previous translations on slow connections
    if (names && names.id === entityId && names.names) {
      const newValues = names.names.reduce(
        (obj, { locale, value }) => ({ ...obj, [locale]: { name: value } }),
        {}
      );
      // Reset the values and its defaults
      setValues({
        reload: true,
        ...newValues,
      });
      dirtySetDefaultValue(newValues);

      // Reset the platform default locale value
      setDefaultLocaleValues(
        {
          ...defaultLocaleValues,
          name: newValues[defaultLocale]?.name || '',
        },
        // Set as not dirty value
        false
      );
    }
  }, [names]);

  // Update the previous default locale value when is changed
  // and the Drawer is closed (the opened case is already handled)
  useEffect(() => {
    if (!drawer.isShown) {
      setPrevDefaultLocaleValue(defaultLocaleValues);
    }
  }, [defaultLocaleValues]);

  const handleSave = () => {
    if (isDirty()) {
      // Set the new values as default
      dirtySetDefaultValue(dirtyValue);
      setPrevDefaultLocaleValue(dirtyValue[defaultLocale]);
      // Send to parent the new values
      onSave(dirtyValue);
      // Hide the drawer
    }
    toggleDrawer();
  };

  const handleCancel = (force = false) => {
    if (force === true || !isDirty()) {
      // Set the values to the default ones (not modified)
      setValues({
        reload: true,
        ...dirtyDefaultValue,
      });
      // Set the default locale value to the previous one
      setDefaultLocaleValues(prevDefaultLocaleValue);
      // Trigger cancel action on parent
      onCancel();
      // Hide the drawer
      toggleDrawer();
    } else {
      setShowSaveWithouSaving(true);
    }
  };

  return (
    <>
      <ExitWithoutSaving
        isShown={showSaveWithouSaving}
        onDiscard={() => {
          setShowSaveWithouSaving(false);
          handleCancel(true);
        }}
        onCancel={() => {
          setShowSaveWithouSaving(false);
        }}
      />
      <TranslationsDrawer {...props} onSave={handleSave} onCancel={handleCancel}>
        <TranslationTab
          warnings={warnings}
          setWarnings={setWarnings}
          defaultLocaleValues={defaultLocaleValues}
          setDefaultLocaleValues={setDefaultLocaleValues}
          values={dirtyValue}
          setValues={setValues}
        />
      </TranslationsDrawer>
    </>
  );
}
Translations.propTypes = {
  defaultLocale: PropTypes.string,
  defaultLocaleValues: PropTypes.object,
  drawer: PropTypes.object,
  entityId: PropTypes.string,
  locale: PropTypes.string,
  localizations: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  setDefaultLocaleValues: PropTypes.func,
  setTreeEntity: PropTypes.element,
  setWarnings: PropTypes.func,
  toggleDrawer: PropTypes.func,
  warnings: PropTypes.object,
};
