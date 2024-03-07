import { ContextContainer, InputWrapper, Select } from '@bubbles-ui/components';
import { useStore } from '@common';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

function UserPreferredGender({ t, user, session, form, isEditMode }) {
  const [store, render] = useStore({
    genders: user.preferences?.gender
      ? [{ label: user.preferences?.gender, value: user.preferences?.gender }]
      : [],
    pronouns: user.preferences?.pronoun
      ? [{ label: user.preferences?.pronoun, value: user.preferences?.pronoun }]
      : [],
    pluralPronouns: user.preferences?.pluralPronoun
      ? [{ label: user.preferences?.pluralPronoun, value: user.preferences?.pluralPronoun }]
      : [],
  });

  function addData(name, e) {
    store[name].push({ label: e, value: e });
    render();
  }

  return (
    <InputWrapper label={t('preferredGenderLabel')}>
      <ContextContainer direction="row">
        <Controller
          name="preferences.gender"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              data={store.genders}
              required
              searchable
              creatable
              disabled={!isEditMode}
              getCreateLabel={(value) => `+ ${value}`}
              onCreate={(e) => addData('genders', e)}
              nothingFound={t('noResults')}
            />
          )}
        />
        <Controller
          name="preferences.pronoun"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              data={store.pronouns}
              required
              searchable
              creatable
              disabled={!isEditMode}
              getCreateLabel={(value) => `+ ${value}`}
              onCreate={(e) => addData('pronouns', e)}
              nothingFound={t('noResults')}
            />
          )}
        />
        <Controller
          name="preferences.pluralPronoun"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              data={store.pluralPronouns}
              required
              searchable
              creatable
              disabled={!isEditMode}
              getCreateLabel={(value) => `+ ${value}`}
              onCreate={(e) => addData('pluralPronouns', e)}
              nothingFound={t('noResults')}
            />
          )}
        />
      </ContextContainer>
    </InputWrapper>
  );
}

UserPreferredGender.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  form: PropTypes.object,
  isEditMode: PropTypes.bool,
  session: PropTypes.object,
};

export default UserPreferredGender;
