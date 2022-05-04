import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller } from 'react-hook-form';

export default function DetailInstructions({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['instructionsForTeachers', 'instructionsForStudents']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer>
      <Controller
        control={form.control}
        name="instructionsForTeachers"
        render={({ field }) => (
          <TextEditorInput
            error={isDirty ? form.formState.errors.instructionsForTeachers : null}
            label={t('instructionsForTeacherLabel')}
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="instructionsForStudents"
        render={({ field }) => (
          <TextEditorInput
            error={isDirty ? form.formState.errors.instructionsForStudents : null}
            label={t('instructionsForStudentLabel')}
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

DetailInstructions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
