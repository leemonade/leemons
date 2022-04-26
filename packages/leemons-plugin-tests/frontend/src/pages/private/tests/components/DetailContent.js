import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller } from 'react-hook-form';

export default function DetailContent({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['statement']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer>
      <Controller
        control={form.control}
        name="statement"
        render={({ field }) => (
          <TextEditorInput
            required
            error={isDirty ? form.formState.errors.statement : null}
            label={t('statementLabel')}
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

DetailContent.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
