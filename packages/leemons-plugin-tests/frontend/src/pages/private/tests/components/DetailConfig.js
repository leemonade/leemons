import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Select, Stack } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';

export default function DetailConfig({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['type']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer>
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <Select
            required
            error={isDirty ? form.formState.errors.type : null}
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
      <Stack justifyContent="end">
        <Button onClick={next}>{t('continue')}</Button>
      </Stack>
    </ContextContainer>
  );
}

DetailConfig.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
