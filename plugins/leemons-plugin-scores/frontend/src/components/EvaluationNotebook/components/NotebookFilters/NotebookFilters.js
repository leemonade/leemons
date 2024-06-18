import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, SearchInput, Select, Stack, Switch } from '@bubbles-ui/components';
import { CalculatorIcon } from '@bubbles-ui/icons/solid';
import { Controller, useForm, useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { WeightConfigDrawer } from '@scores/components/Weights/components/WeightConfigDrawer';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import useSearchTypes from './hooks/useSearchTypes';
import useOnChange from './hooks/useOnChange';

export default function NotebookFilters({ filters, onChange, value }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.filters'));
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const deploymentConfig = useDeploymentConfig({ pluginName: 'scores', ignoreVersion: true });
  const hideWeighting = deploymentConfig?.deny?.menu?.includes('scores.weights');

  const form = useForm({
    defaultValues: {
      searchType: 'student',
    },
  });
  const { setValue, getValues } = form;

  const searchType = useWatch({ control: form.control, name: 'searchType' });

  const searchTypes = useSearchTypes();

  useEffect(() => {
    if (value) {
      const values = getValues();

      if (value.search && value.search !== values.search) {
        setValue('search', value.search);
      }

      if (value.searchType && value.searchType !== values.searchType) {
        setValue('searchType', value.searchType);
      }

      if (value.showNonEvaluable && value.showNonEvaluable !== values.showNonEvaluable) {
        setValue('showNonEvaluable', value.showNonEvaluable);
      }
    }
  }, [value, setValue, getValues]);

  useOnChange({ onChange, control: form.control });

  return (
    <>
      <WeightConfigDrawer
        class={drawerIsOpen ? filters?.class : null}
        onClose={() => setDrawerIsOpen(false)}
      />

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
            render={({ field }) => (
              <Switch {...field} checked={field.value} label={t('showNonEvaluable')} />
            )}
          />
          <Box>
            {!hideWeighting && (
              <Button
                variant="linkInline"
                leftIcon={<CalculatorIcon />}
                onClick={() => setDrawerIsOpen(true)}
              >
                {t('goToWeighting')}
              </Button>
            )}
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

NotebookFilters.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.object,
};
