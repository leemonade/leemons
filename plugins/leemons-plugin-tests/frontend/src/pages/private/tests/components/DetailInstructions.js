import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, Stack } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';

export default function DetailInstructions({ form, t, onPublish, onAssign, onPrev }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['instructionsForTeachers', 'instructionsForStudents']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer divided>
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
      </ContextContainer>
      <Stack justifyContent="space-between">
        <Box>
          <Button
            compact
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={onPrev}
          >
            {t('previous')}
          </Button>
        </Box>
        <Stack spacing={2}>
          <Box>
            <Button variant="outline" onClick={onPublish}>
              {t('onlyPublish')}
            </Button>
          </Box>
          <Box>
            <Button onClick={onAssign}>{t('publishAndAssign')}</Button>
          </Box>
        </Stack>
      </Stack>
    </ContextContainer>
  );
}

DetailInstructions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onPublish: PropTypes.func,
  onAssign: PropTypes.func,
  onPrev: PropTypes.func,
};
