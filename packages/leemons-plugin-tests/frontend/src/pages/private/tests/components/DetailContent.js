import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, Stack } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import Curriculum from '@tasks/components/TaskSetupPage/components/Curriculum';

export default function DetailContent({ form, t, onNext, onPrev }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['statement']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer divided>
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

        <Curriculum
          program={form.getValues('program')}
          subjects={form.getValues('subjects')}
          name="curriculum"
          control={form.control}
          addLabel={t('addFromCurriculum')}
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
        <Box>
          <Button onClick={next}>{t('continue')}</Button>
        </Box>
      </Stack>
    </ContextContainer>
  );
}

DetailContent.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
};
