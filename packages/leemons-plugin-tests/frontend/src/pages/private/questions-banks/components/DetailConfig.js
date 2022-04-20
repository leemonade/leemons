import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack, Textarea, TextInput } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TagsAutocomplete } from '@common';

export default function DetailConfig({ form, t, store, render, onNext }) {
  function next() {
    form.handleSubmit(() => {
      onNext();
    })();
  }

  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    store.activeStep = 'config';
    render();
  }, []);

  return (
    <ContextContainer>
      <Controller
        control={form.control}
        name="name"
        rules={{ required: t('nameRequired') }}
        render={({ field }) => (
          <TextInput
            required
            error={form.formState.errors.name}
            label={t('nameLabel')}
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="tagline"
        rules={{ required: t('taglineRequired') }}
        render={({ field }) => (
          <TextInput
            required
            error={form.formState.errors.tagline}
            label={t('taglineLabel')}
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="summary"
        rules={{ required: t('summaryRequired') }}
        render={({ field }) => (
          <Textarea
            required
            error={form.formState.errors.summary}
            label={t('summaryLabel')}
            {...field}
          />
        )}
      />

      <Controller
        control={form.control}
        name="tags"
        render={({ field }) => (
          <TagsAutocomplete
            pluginName="tests"
            label={t('tagsLabel')}
            labels={{ addButton: t('addTag') }}
            {...field}
          />
        )}
      />
      <Stack justifyContent="end">
        <Button onClick={next}>{t('continue')}</Button>
      </Stack>
    </ContextContainer>
  );
}

DetailConfig.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
};
