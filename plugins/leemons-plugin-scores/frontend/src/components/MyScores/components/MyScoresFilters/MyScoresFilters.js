import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { SearchInput, Stack, Switch } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';

import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useMyScoresSubjects from './hooks/useMyScoresSubjects';
import useOnChange from './hooks/useOnChange';

export default function MyScoresFilters({ filters, onChange, value }) {
  const [t] = useTranslateLoader(prefixPN('myScores.localFilters'));
  const form = useForm();
  const { getValues, setValue } = form;

  const { data: subjects } = useMyScoresSubjects(filters);

  useOnChange({ control: form.control, onChange });

  useEffect(() => {
    if (value.subject && getValues('subject') !== value.subject) {
      setValue('subject', value.subject);
    }

    if (value.search && getValues('search') !== value.search) {
      setValue('search', value.search);
    }
  }, [value, setValue, getValues]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
      <Stack direction="row" spacing={4}>
        <Controller
          name="subject"
          control={form.control}
          render={({ field }) => (
            <SelectSubject
              {...field}
              data={subjects.map((subject) => ({
                ...subject,
                label: subject.name,
                value: subject.id,
              }))}
              disabled={subjects.length === 0}
              placeholder={t('subject')}
            />
          )}
        />
        <Controller
          name="search"
          control={form.control}
          render={({ field }) => (
            <SearchInput {...field} sx={{ width: 220 }} placeholder={t('search')} />
          )}
        />
      </Stack>

      <Controller
        name="showNonEvaluable"
        control={form.control}
        defaultValue={false}
        render={({ field }) => <Switch {...field} label={t('seeNonEvaluable')} />}
      />
    </Stack>
  );
}

MyScoresFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
};
