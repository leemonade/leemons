import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ContextContainer,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TagsAutocomplete } from '@common';

export default function DetailConfig({ form, t, onNext }) {
  async function next() {
    const formGood = await form.trigger(['name', 'type', 'tagline', 'summary', 'tags']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer>
      <Controller
        control={form.control}
        name="name"
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
        name="type"
        render={({ field }) => (
          <Select
            required
            error={form.formState.errors.type}
            label={t('typeLabel')}
            data={[
              {
                label: t('learn'),
                value: 'learn',
              },
            ]}
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="tagline"
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
};
