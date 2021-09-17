import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { TranslationsDrawer } from '../../../multilanguage/translationsDrawer';
import useGetNames from '../../../../hooks/levelschema/useGetNames';
import FormControl from 'leemons-ui/dist/components/ui/FormControl';

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
  defaultLocaleValues,
  entityId,
  locale: userLocale,
  localizations,
  onCancel = () => {},
  onSave = () => {},
  setDefaultLocaleValues,
  setTreeEntity,
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
      // Modify the entity in the tree
      if (locale !== defaultLocale && locale === userLocale) {
        console.log('Updating entity in the tree [Translations]');
        setTreeEntity({ name: value.name });
      }
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
