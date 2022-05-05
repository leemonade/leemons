import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ContextContainer,
  MultiSelect,
  Select,
  Stack,
  Switch,
} from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { groupBy, map, uniqBy } from 'lodash';
import { useStore } from '@common';
import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import { useTestsTypes } from '../../../../helpers/useTestsTypes';

export default function DetailConfig({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [store, render] = useStore({
    subjectsByProgram: {},
  });
  const testTypes = useTestsTypes();
  const program = form.watch('program');
  const type = form.watch('type');
  const selectedType = testTypes.find(({ value }) => value === type);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['type']);
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
    <ContextContainer>
      <Controller
        control={form.control}
        name="program"
        rules={{ required: t('programRequired') }}
        render={({ field }) => (
          <Select
            required
            error={isDirty ? form.formState.errors.program : null}
            label={t('programLabel')}
            data={store.programsData || []}
            {...field}
          />
        )}
      />

      <Controller
        control={form.control}
        name="subjects"
        rules={{ required: t('subjectRequired') }}
        render={({ field }) => (
          <MultiSelect
            required
            error={isDirty ? form.formState.errors.subjects : null}
            label={t('subjectLabel')}
            disabled={!program}
            data={store.subjectsByProgram[program] || []}
            {...field}
          />
        )}
      />

      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <Select
            required
            error={isDirty ? form.formState.errors.type : null}
            label={t('typeLabel')}
            data={testTypes}
            {...field}
          />
        )}
      />

      {selectedType && selectedType.canGradable ? (
        <Controller
          control={form.control}
          name="gradable"
          render={({ field }) => (
            <Switch {...field} label={t('gradableLabel')} checked={field.value} />
          )}
        />
      ) : null}

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
