import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ContextContainer,
  ListInput,
  MultiSelect,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TagsAutocomplete, useStore } from '@common';
import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import { groupBy, map, uniqBy } from 'lodash';

export default function DetailConfig({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [store, render] = useStore({
    subjectsByProgram: {},
  });
  const program = form.watch('program');

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['name', 'program', 'subjects', 'tagline', 'summary']);
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
    console.log(store);
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
        name="name"
        rules={{ required: t('nameRequired') }}
        render={({ field }) => (
          <TextInput
            required
            error={isDirty ? form.formState.errors.name : null}
            label={t('nameLabel')}
            {...field}
          />
        )}
      />

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
        name="categories"
        render={({ field }) => <ListInput {...field} label={t('categoriesLabel')} canAdd />}
      />

      <Controller
        control={form.control}
        name="tagline"
        rules={{ required: t('taglineRequired') }}
        render={({ field }) => (
          <TextInput
            required
            error={isDirty ? form.formState.errors.tagline : null}
            label={t('taglineLabel')}
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="summary"
        rules={{ required: t('summaryRequired') }}
        render={({ field }) => (
          <Textarea
            required
            error={isDirty ? form.formState.errors.summary : null}
            label={t('summaryLabel')}
            {...field}
          />
        )}
      />

      <Controller
        control={form.control}
        name="tags"
        render={({ field }) => (
          <TagsAutocomplete
            pluginName="tests"
            type="plugins.tests.questionBanks"
            label={t('tagsLabel')}
            labels={{ addButton: t('addTag') }}
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
