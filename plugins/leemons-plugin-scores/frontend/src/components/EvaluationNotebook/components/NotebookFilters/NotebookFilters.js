import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  Box,
  Button,
  SearchInput,
  Select,
  Stack,
  Switch,
  DropdownButton,
} from '@bubbles-ui/components';
import { CalculatorIcon } from '@bubbles-ui/icons/solid';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { ManualActivityDrawer } from '../ManualActivityDrawer';

import useOnChange from './hooks/useOnChange';
import useSearchTypes from './hooks/useSearchTypes';

import { WeightConfigDrawer } from '@scores/components/Weights/components/WeightConfigDrawer';
import { prefixPN } from '@scores/helpers';
import { useCreateManualActivityMutation } from '@scores/requests/hooks/mutations/useCreateManualActivityMutation';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';

export default function NotebookFilters({ filters, onChange, value }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.filters'));
  const [weightDrawerIsOpen, setWeightDrawerIsOpen] = useState(false);
  const [manualActivityDrawerIsOpen, setManualActivityDrawerIsOpen] = useState(false);
  const deploymentConfig = useDeploymentConfig({ pluginName: 'scores', ignoreVersion: true });
  const hideWeighting = deploymentConfig?.deny?.menu?.includes('scores.weights');
  const { mutateAsync: createManualActivity } = useCreateManualActivityMutation();

  const isPeriodPublished = useEvaluationNotebookStore((state) => state.isPeriodPublished);

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
        class={weightDrawerIsOpen ? filters?.class : null}
        onClose={() => setWeightDrawerIsOpen(false)}
      />
      <ManualActivityDrawer
        classId={filters?.class?.id}
        isOpen={manualActivityDrawerIsOpen}
        onClose={() => setManualActivityDrawerIsOpen(false)}
        minDate={new Date(filters?.period?.startDate)}
        maxDate={new Date(filters?.period?.endDate)}
        onSubmit={async (data) => {
          try {
            await createManualActivity({
              ...data,
              classId: filters.class.id,
            });
            addSuccessAlert(t('manualActivityCreated'));
          } catch (e) {
            addErrorAlert(t('manualActivityError'), e.message);
            throw e;
          }
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
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
        <Stack direction="row" spacing={4} alignItems="center">
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
                onClick={() => setWeightDrawerIsOpen(true)}
              >
                {t('goToWeighting')}
              </Button>
            )}
          </Box>
          <DropdownButton
            data={[
              {
                label: t('manualActivity'),
                onClick: () => setManualActivityDrawerIsOpen(true),
                disabled: isPeriodPublished,
              },
            ]}
          >
            {t('add')}
          </DropdownButton>
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
