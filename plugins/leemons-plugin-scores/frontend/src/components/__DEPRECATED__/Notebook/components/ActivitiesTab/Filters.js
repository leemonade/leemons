import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  createStyles,
  Switch,
  SearchInput,
  Select,
  Text,
  TotalLayoutFooterContainer,
  Stack,
} from '@bubbles-ui/components';
import _, { isFunction } from 'lodash';
import propTypes from 'prop-types';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useLayout } from '@layout/context';
import { ScoresFooter } from '@scores/components/__DEPRECATED__/ScoresFooter';

const useStyles = createStyles((theme) => ({
  filters: {
    backgroundColor: theme.colors.interactive03,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
    width: '100%',
  },
  leftFilters: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  leftFiltersGroup: {
    gap: theme.spacing[1],
  },
}));

const useEvaluationReportModalStyles = createStyles((theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
  },
}));

export function useFilterByLength(filterBy, labels) {
  return React.useMemo(() => {
    const valuesMaxLength = filterBy.reduce(
      (maxLength, filter) => Math.max(maxLength, filter.label.length),
      0
    );
    return Math.max(valuesMaxLength, labels?.filterBy?.placeholder?.length || 0);
  }, [filterBy]);
}

function useOnchangeEmitter(onChange, watch) {
  React.useEffect(() => {
    if (isFunction(onChange)) {
      const subscription = watch((values) => {
        onChange(values);
      });

      return subscription.unsubscribe;
    }
    return () => {};
  }, [onChange, watch]);
}

function useFilterByOptions(labels) {
  return React.useMemo(
    () => [
      {
        label: labels?.filterBy?.activity,
        value: 'activity',
      },
      {
        label: labels?.filterBy?.student,
        value: 'student',
      },
    ],
    []
  );
}

function useFiltersLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('notebook.tabs.activities.filters.evaluationReport'),
    prefixPN('notebook.tabs.activities.filters.finalReport'),
  ]);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const evaluation = _.get(res, prefixPN('notebook.tabs.activities.filters.evaluationReport'));
      const final = _.get(res, prefixPN('notebook.tabs.activities.filters.finalReport'));

      return {
        evaluation,
        final,
      };
    }

    return {};
  }, [translations]);
}

function useEvaluationReportModal({ labels: _labels, onConfirm }) {
  const labels = _labels?.modal;
  const { openConfirmationModal } = useLayout();

  const { classes } = useEvaluationReportModalStyles();

  return React.useCallback(
    () =>
      openConfirmationModal({
        title: labels?.title,
        description: (
          <Box className={classes.body}>
            <Text role="expressive">{labels?.msg1}</Text>
            <Text role="expressive">{labels?.msg2}</Text>
          </Box>
        ),
        labels: {
          confirm: labels?.confirm,
          cancel: labels?.cancel,
        },
        onConfirm,
      })(),
    [openConfirmationModal, labels, onConfirm]
  );
}

export function Filters({
  onChange,
  labels,
  period,
  onSubmitEvaluationReport,
  isPeriodSubmitted,
  scrollRef,
}) {
  const { classes, theme, cx } = useStyles();
  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: '',
      filterBy: 'student',
      showNonCalificables: false,
    },
  });

  useOnchangeEmitter(onChange, watch);

  const evaluationType = React.useMemo(() => {
    const id = period?.period?.id;

    if (id === 'final') {
      return 'final';
    }

    return 'evaluation';
  }, [period?.period?.id]);

  const evaluationReportLabels = useFiltersLocalizations();
  const showEvaluationReportModal = useEvaluationReportModal({
    labels: evaluationReportLabels?.evaluation,
    onConfirm: onSubmitEvaluationReport,
  });
  const isFinalEvaluation = evaluationType === 'final';

  const filterBy = useFilterByOptions(labels);
  const filterByLength = useFilterByLength(filterBy, labels);

  const showEvaluationReport = React.useMemo(
    () => !isPeriodSubmitted && period?.period?.type === 'academic-calendar',
    [period, isPeriodSubmitted]
  );

  React.useEffect(() => setValue('filterBy', 'student'), [isFinalEvaluation]);

  return (
    <Stack direction="column">
      <Box className={classes.filters}>
        <Box className={classes.leftFilters}>
          <Box className={cx(classes.leftFilters, classes.leftFiltersGroup)}>
            {!isFinalEvaluation && (
              <Controller
                control={control}
                name="filterBy"
                render={({ field }) => (
                  <>
                    <Select
                      placeholder={labels?.filterBy?.placeholder}
                      style={{ width: `${filterByLength + 5}ch` }}
                      data={filterBy}
                      ariaLabel={labels?.filterBy?.placeholder}
                      {...field}
                    />
                  </>
                )}
              />
            )}
            <Controller
              control={control}
              name="search"
              render={({ field }) => {
                const filterByValue = watch('filterBy');
                return (
                  <SearchInput
                    wait={300}
                    placeholder={labels?.search
                      ?.replace(
                        '{{filterBy}}',
                        filterBy.find((item) => item.value === filterByValue).label
                      )
                      ?.replace(
                        '{{filterBy.toLowerCase}}',
                        filterBy.find((item) => item.value === filterByValue).label.toLowerCase()
                      )}
                    {...field}
                  />
                );
              }}
            />
          </Box>
          {!isFinalEvaluation && (
            <Controller
              control={control}
              name="showNonCalificables"
              render={({ field }) => (
                <Box>
                  <Switch
                    size="xs"
                    color={theme.colors.interactive01}
                    label={labels?.nonCalificables}
                    {...field}
                    checked={field.value}
                  />
                </Box>
              )}
            />
          )}
          {/* <Switch size="md" label="Asessment criteria" /> */}
        </Box>
      </Box>
      <TotalLayoutFooterContainer
        fixed
        noFlex
        fullWidth
        scrollRef={scrollRef}
        rightZone={
          <ScoresFooter
            allowDownload
            showEvaluationReport={showEvaluationReport}
            evaluationReportLabels={evaluationReportLabels}
            evaluationType={evaluationType}
            isPeriodSubmitted={isPeriodSubmitted}
            showEvaluationReportModal={showEvaluationReportModal}
          />
        }
      />
    </Stack>
  );
}

Filters.propTypes = {
  onChange: propTypes.func,
  labels: propTypes.object,
  period: propTypes.object,
  onSubmitEvaluationReport: propTypes.func,
  isPeriodSubmitted: propTypes.bool,
  scrollRef: propTypes.any,
};

export default Filters;
