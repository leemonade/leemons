import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Text, TextInput, NumberInput, Stack } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';

// eslint-disable-next-line import/prefer-default-export
export function LikertScale({ form, t }) {
  const maxLabels = form.watch('properties.maxLabels');

  const renderLabelInputs = () => {
    const labelInputs = [];
    for (let i = 0; i < maxLabels; i++) {
      labelInputs.push(
        <Controller
          control={form.control}
          shouldUnregister
          name={`properties.likertLabel${i}`}
          render={({ field }) => (
            <TextInput
              label={`${i + 1}`}
              orientation="horizontal"
              placeholder={t('labelsPlaceholder')}
              headerStyle={{ justifyContent: 'center', width: 20 }}
              contentStyle={{ maxWidth: 370 }}
              {...field}
            />
          )}
        />
      );
    }
    return labelInputs;
  };

  return (
    <ContextContainer style={{ marginTop: 32 }}>
      <Text color="primary" role="productive" stronger size="md">
        {t('likertSettings')}
      </Text>
      <Stack spacing={4}>
        <NumberInput
          label={t('maxLabelsFrom')}
          orientation="horizontal"
          value={1}
          min={1}
          max={1}
          disabled
          headerStyle={{ justifyContent: 'center', width: 'auto' }}
          contentStyle={{ width: 60 }}
        />
        <Controller
          control={form.control}
          shouldUnregister
          name="properties.maxLabels"
          render={({ field }) => (
            <NumberInput
              label={t('maxLabelsTo')}
              orientation="horizontal"
              step={2}
              min={3}
              max={7}
              headerStyle={{ justifyContent: 'center', width: 'auto' }}
              contentStyle={{ width: 60 }}
              {...field}
            />
          )}
        />
      </Stack>
      <Stack spacing={2} direction="column" style={{ marginBottom: 40 }}>
        {renderLabelInputs()}
      </Stack>
    </ContextContainer>
  );
}

LikertScale.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
