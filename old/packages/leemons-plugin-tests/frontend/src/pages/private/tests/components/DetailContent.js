import { Box, Button, ContextContainer, Stack, Title } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import Curriculum from '@tasks/components/TaskSetupPage/components/Curriculum';
import Objectives from '@tasks/components/TaskSetupPage/components/Objectives';
import _, { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

export default function DetailContent({ store, form, t, onNext, onPrev }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['statement']);
    if (formGood) {
      onNext();
    }
  }

  const programId = form.getValues('program');
  const subjectIds = form.getValues('subjects');

  const subjects = store.subjectsByProgram[programId];
  const subject = find(subjects, { value: subjectIds?.[0].subject });

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

        <Title order={3}>{t('curriculum')}</Title>
        {subject ? <Title order={5}>{subject.label}</Title> : null}

        <Curriculum
          program={form.getValues('program')}
          subjects={_.map(form.getValues('subjects'), 'subject')}
          name="curriculum.curriculum"
          control={form.control}
          addLabel={t('addFromCurriculum')}
        />
        <Objectives form={form} name={`curriculum.objectives`} label={t('objectivesCurriculum')} />
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
  store: PropTypes.any,
};
