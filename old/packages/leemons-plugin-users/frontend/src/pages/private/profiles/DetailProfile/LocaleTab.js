import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get, isNil, keysIn } from 'lodash';
import { Controller } from 'react-hook-form';
import { ContextContainer, TextInput, Textarea, Loader } from '@bubbles-ui/components';
import getProfileTranslations from '@users/request/getProfileTranslations';

// eslint-disable-next-line import/prefer-default-export
export const LocaleTab = ({ localeConfig, form, tCommonForm, t, profile, isEditMode }) => {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [formKeys, setFormKeys] = useState({ name: 'name', description: 'description' });
  const [nameRules, setNameRules] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isNil(profile) && !isNil(localeConfig) && !keysIn(values).length) {
        setLoading(true);
        const result = await getProfileTranslations(profile.id);
        if (mounted) {
          setLoading(false);

          let nameKey = `translations.name.${localeConfig.currentLocale.code}`;
          let descriptionKey = `translations.description.${localeConfig.currentLocale.code}`;

          if (localeConfig.currentLocaleIsDefaultLocale) {
            result.name = profile.name;
            result.description = profile.description;
            nameKey = 'name';
            descriptionKey = 'description';
            setNameRules({ ...nameRules, required: tCommonForm('required') });
          }

          setValues(result);
          setFormKeys({ name: nameKey, description: descriptionKey });

          if (!isNil(form)) {
            // Prioritize translations saved in the profile
            form.setValue(nameKey, get(profile, nameKey) || result.name);
            form.setValue(descriptionKey, get(profile, descriptionKey) || result.description);
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [profile, localeConfig]);

  return (
    <>
      {loading && <Loader padded />}
      {!loading && !isNil(form) && (
        <ContextContainer padded="vertical">
          <Controller
            name={formKeys.name}
            control={form.control}
            defaultValue={values.name}
            rules={{ ...nameRules }}
            render={({ field }) => (
              <TextInput
                label={t('options_modal.profile_name')}
                placeholder={t('options_modal.profile_name')}
                orientation="horizontal"
                error={get(form.formState.errors, formKeys.name)}
                readOnly={!isEditMode}
                required={!isNil(nameRules.required)}
                {...field}
              />
            )}
          />
          <Controller
            name={formKeys.description}
            control={form.control}
            defaultValue={values.description}
            render={({ field }) => (
              <Textarea
                label={t('options_modal.profile_description')}
                placeholder={t('options_modal.profile_description')}
                orientation="horizontal"
                error={get(form.formState.errors, formKeys.description)}
                readOnly={!isEditMode}
                {...field}
              />
            )}
          />
        </ContextContainer>
      )}
    </>
  );
};

LocaleTab.propTypes = {
  t: PropTypes.func,
  profile: PropTypes.any,
  isEditMode: PropTypes.bool,
  tCommonForm: PropTypes.func,
  localeConfig: PropTypes.any,
  form: PropTypes.any,
};
