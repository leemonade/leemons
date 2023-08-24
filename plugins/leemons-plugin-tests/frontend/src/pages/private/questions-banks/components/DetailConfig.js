import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import {
  Box,
  Button,
  ContextContainer,
  ListInput,
  MultiSelect,
  Select,
  Stack,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { groupBy, map, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

export default function DetailConfig({ form, t, onNext, onPrev }) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [store, render] = useStore({
    subjectsByProgram: {},
  });
  const program = form.watch('program');

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['program', 'subjects']);
    if (formGood) {
      onNext();
    }
  }

  async function load() {
    const [{ programs }, { classes }] = await Promise.all([
      getUserProgramsRequest(),
      listSessionClassesRequest(),
    ]);
    store.subjects = uniqBy(map(classes, 'subject'), 'id');
    store.subjectsByProgram = groupBy(
      map(store.subjects, (item) => ({
        value: item.id,
        label: item.name,
        program: item.program,
      })),
      'program'
    );
    store.programs = programs;
    store.programsData = map(programs, ({ id, name }) => ({ value: id, label: name }));
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Controller
          control={form.control}
          name="program"
          // rules={{ required: t('programRequired') }}
          render={({ field }) => (
            <Select
              // required
              error={isDirty ? form.formState.errors.program : null}
              label={t('programLabel')}
              data={store.programsData || []}
              autoSelectOneOption
              {...field}
            />
          )}
        />

        <Controller
          control={form.control}
          name="subjects"
          // rules={{ required: t('subjectRequired') }}
          render={({ field }) => (
            <MultiSelect
              // required
              error={isDirty ? form.formState.errors.subjects : null}
              label={t('subjectLabel')}
              disabled={!program}
              data={store.subjectsByProgram[program] || []}
              autoSelectOneOption
              {...field}
            />
          )}
        />

        <Controller
          control={form.control}
          name="categories"
          render={({ field }) => (
            <ListInput
              {...field}
              label={t('categoriesLabel')}
              addButtonLabel={t('addCategory')}
              canAdd
            />
          )}
        />
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Box>
          <Button
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={onPrev}
          >
            {t('previous')}
          </Button>
        </Box>
        <Box>
          <Button rightIcon={<ChevRightIcon height={20} width={20} />} onClick={next}>
            {t('continue')}
          </Button>
        </Box>
      </Stack>
    </ContextContainer>
  );
}

DetailConfig.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
};
