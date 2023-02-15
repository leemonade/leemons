import React, { useEffect, useMemo } from 'react';
import { Box, SearchInput, Select, MultiSelect, Button } from '@bubbles-ui/components';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { isFunction } from 'lodash';
import { SelectProgram } from '@academic-portfolio/components';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { FILTERS_PROP_TYPES, FILTERS_DEFAULT_PROPS } from './Filters.constants';
import { FilterStyles } from './Filters.styles';

const useFormatAndStatusData = (labels) => {
  const isTeacher = useIsTeacher();
  return useMemo(() => {
    if (!labels.formats || !labels.statuses) return [[], []];
    const formatLabels = { ...labels.formats };
    if (isTeacher) delete formatLabels.modal;
    const formatData = Object.keys(formatLabels).map((label) => ({
      // eslint-disable-next-line no-nested-ternary
      value: label === 'banner' ? (isTeacher ? 'class-dashboard' : 'dashboard') : label,
      label: labels.formats[label],
    }));
    const statusData = Object.keys(labels.statuses).map((label) => ({
      value: label,
      label: labels.statuses[label],
    }));
    return [formatData, statusData];
  }, [labels]);
};

const Filters = ({ labels, defaultValues, filters, setFilters, centers, profiles }) => {
  const { control, reset, watch, setValue } = useForm({ defaultValues });
  const formValues = useWatch({ control });

  const centerValue = watch('centers');

  const [formatData, statusData] = useFormatAndStatusData(labels);

  // const clearForm = () => {
  //   reset(defaultValues);
  // };

  useEffect(() => {
    if (isFunction(setFilters) && JSON.stringify(formValues) !== JSON.stringify(filters)) {
      const finalValues = {
        ...formValues,
        centers: formValues.centers ? [formValues.centers] : null,
      };
      setFilters(finalValues);
    }
  }, [JSON.stringify(formValues)]);

  useEffect(() => {
    setValue('program', '');
  }, [centerValue]);

  const { classes } = FilterStyles({}, { name: 'MessagesTable' });
  return (
    <Box className={classes.root}>
      <Controller
        control={control}
        name="internalName"
        render={({ field }) => (
          <SearchInput
            wait={200}
            label={labels.search}
            placeholder={labels.searchPlaceholder}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="centers"
        render={({ field }) => (
          <Select
            data={centers}
            label={labels.center}
            placeholder={labels.centerPlaceholder}
            {...field}
            clearable={labels.clear}
            autoSelectOneOption
          />
        )}
      />
      <Controller
        control={control}
        name="programs"
        render={({ field }) => (
          <SelectProgram
            center={centerValue}
            label={labels.program}
            placeholder={labels.programPlaceholder}
            clearable={labels.clear}
            autoSelectOneOption={false}
            multiple
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="profiles"
        render={({ field }) => (
          <MultiSelect
            data={profiles}
            label={labels.profile}
            placeholder={labels.profilePlaceholder}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="zone"
        render={({ field }) => (
          <Select
            data={formatData}
            label={labels.format}
            placeholder={labels.formatPlaceholder}
            clearable={labels.clear}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            data={statusData}
            label={labels.state}
            placeholder={labels.statePlaceholder}
            clearable={labels.clear}
            {...field}
          />
        )}
      />
      {/* <Box>
        <Button onClick={clearForm}>{labels.clear}</Button>
      </Box> */}
    </Box>
  );
};

Filters.defaultProps = FILTERS_DEFAULT_PROPS;
Filters.propTypes = FILTERS_PROP_TYPES;

// eslint-disable-next-line import/prefer-default-export
export { Filters };
