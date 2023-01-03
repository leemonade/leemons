import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Text, TextInput, Stack, Alert } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';

// eslint-disable-next-line import/prefer-default-export
export function NetPromoterScore({ form, t }) {
  return (
    <ContextContainer style={{ marginTop: 32 }}>
      <Text color="primary" role="productive" stronger size="md">
        {t('npsSettings')}
      </Text>
      <Alert severity="info" closeable={false} title="Info">
        {t('npsInfo')}
      </Alert>
      <Stack spacing={2} direction="column" style={{ marginBottom: 40 }}>
        <Controller
          control={form.control}
          shouldUnregister
          name="properties.notLikely"
          render={({ field }) => (
            <TextInput
              label={'1'}
              orientation="horizontal"
              headerStyle={{ justifyContent: 'center', width: 20 }}
              contentStyle={{ maxWidth: 370 }}
              {...field}
            />
          )}
        />
        <Controller
          control={form.control}
          shouldUnregister
          name="properties.veryLikely"
          render={({ field }) => (
            <TextInput
              label={'10'}
              orientation="horizontal"
              headerStyle={{ justifyContent: 'center', width: 20 }}
              contentStyle={{ maxWidth: 370 }}
              {...field}
            />
          )}
        />
      </Stack>
    </ContextContainer>
  );
}

NetPromoterScore.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
