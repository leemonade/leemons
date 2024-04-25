import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, SearchInput, Select, Stack, Switch } from '@bubbles-ui/components';
import { CalculatorIcon } from '@bubbles-ui/icons/solid';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useSearchTypes from './hooks/useSearchTypes';
import useOnChange from './hooks/useOnChange';

export default function NotebookFilters({ filters, onChange }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.filters'));
  const form = useForm({
    defaultValues: {
      searchType: 'student',
    },
  });

  const searchType = useWatch({ control: form.control, name: 'searchType' });
  useOnChange({ onChange, control: form.control });

  const searchTypes = useSearchTypes();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
      <Stack direction="row" spacing={4}>
        <Controller
          name="searchType"
          control={form.control}
          render={({ field }) => <Select {...field} data={searchTypes} />}
        />
        <Controller
          name="search"
          control={form.control}
          defaultValue=""
          render={({ field }) => (
            <SearchInput
              {...field}
              placeholder={t('search', { type: t(`searchTypes.${searchType}`).toLowerCase() })}
              sx={{ width: 220 }}
            />
          )}
        />
      </Stack>
      <Stack direction="row" spacing={4} alignItems="baseline">
        <Controller
          name="showNonEvaluable"
          control={form.control}
          defaultValue={false}
          render={({ field }) => <Switch {...field} label={t('showNonEvaluable')} />}
        />
        <Box>
          <Link
            to={`/private/scores/weights?program=${filters?.program}&class=${filters?.class?.id}`}
          >
            <Button variant="linkInline" leftIcon={<CalculatorIcon />}>
              {t('goToWeighting')}
            </Button>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}

NotebookFilters.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func,
};
