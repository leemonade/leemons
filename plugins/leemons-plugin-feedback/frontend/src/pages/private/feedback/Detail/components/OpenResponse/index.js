import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Text, NumberInput, Stack } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';

// eslint-disable-next-line import/prefer-default-export
export function OpenResponse({ form, t }) {
  return (
    <ContextContainer style={{ marginTop: 32 }}>
      <Text color="primary" role="productive" stronger size="md">
        {t('openResponseSettings')}
      </Text>
      <Stack spacing={2} direction="column" style={{ marginBottom: 40 }}>
        <Controller
          control={form.control}
          shouldUnregister
          name="properties.maxCharacters"
          render={({ field }) => (
            <NumberInput
              label={t('maxCharacters')}
              orientation="horizontal"
              max={2000}
              headerStyle={{ justifyContent: 'center', width: 'auto' }}
              contentStyle={{ maxWidth: 100 }}
              {...field}
            />
          )}
        />
      </Stack>
    </ContextContainer>
  );
}

OpenResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
