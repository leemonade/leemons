import React, { useEffect, useMemo, useState } from 'react';
import { Box, SearchInput, Select, MultiSelect, Button } from '@bubbles-ui/components';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { getUserPrograms } from '@academic-portfolio/request/programs';
import { listProgramsRequest } from '@academic-portfolio/request';
import { addErrorAlert } from '@layout/alert';
import { FilterStyles } from './Filters.styles';
import { FILTERS_PROP_TYPES, FILTERS_DEFAULT_PROPS } from './Filters.constants';

const useFormatAndStatusData = (labels, isTeacher) =>
  useMemo(() => {
    if (!labels.formats || !labels.statuses) return [[], []];
    const formatLabels = { ...labels.formats };
    const statusLabels = { ...labels.statuses };
    delete statusLabels.archived;
    if (isTeacher) delete formatLabels.modal;

    const formatData = Object.keys(formatLabels).map((label) => ({
      // eslint-disable-next-line no-nested-ternary
      value: label === 'banner' ? (isTeacher ? 'class-dashboard' : 'dashboard') : label,
      label: labels.formats[label],
    }));
    const statusData = Object.keys(statusLabels).map((label) => ({
      value: label,
      label: labels.statuses[label],
    }));
    return [formatData, statusData];
  }, [labels, isTeacher]);

const Filters = ({
  labels,
  defaultValues,
  filters,
  setFilters,
  centers,
  profiles,
  onlyArchived,
}) => {
  const isTeacher = useIsTeacher();
  const { control, reset, watch, setValue } = useForm({ defaultValues });
  const formValues = useWatch({ control });
  const [programs, setPrograms] = useState([]);

  const centerValue = watch('centers');

  const [formatData, statusData] = useFormatAndStatusData(labels, isTeacher);

  // const clearForm = () => {
  //   reset(defaultValues);
  // };

  const getAllPrograms = async () => {
    try {
      let allPrograms = [];
      if (isTeacher) {
        const { programs: results } = await getUserPrograms();
        allPrograms = results;
      } else {
        const {
          data: { items: listResult },
        } = await listProgramsRequest({ page: 0, size: 9999, center: centerValue });
        allPrograms = listResult;
      }
      if (allPrograms.length > 0) {
        setPrograms(allPrograms.map((program) => ({ label: program.name, value: program.id })));
      }
    } catch (error) {
      addErrorAlert(error);
    }
  };

  useEffect(() => {
    const finalValues = {
      ...formValues,
      centers: formValues.centers ? [formValues.centers] : null,
      status: !formValues.status
        ? ['published', 'unpublished', 'completed', 'programmed']
        : formValues.status,
    };
    setFilters(finalValues);
  }, [JSON.stringify(formValues)]);

  useEffect(() => {
    setValue('program', '');
    getAllPrograms();
  }, [centerValue]);

  const { classes } = FilterStyles({}, { name: 'MessagesTable' });
  return (
    <Box className={classes.root}>
      <Controller
        control={control}
        name="internalName"
        render={({ field: { ref, ...field } }) => (
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
            style={{ visibility: isTeacher && 'hidden', position: isTeacher && 'absolute' }}
          />
        )}
      />
      <Controller
        control={control}
        name="programs"
        render={({ field }) => (
          <MultiSelect
            data={programs}
            label={labels.program}
            placeholder={labels.programPlaceholder}
            clearable={labels.clear}
            autoSelectOneOption={false}
            disabled={isTeacher ? !programs.length : !centerValue || !programs.length}
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
            autoSelectOneOption
          />
        )}
      />
      {!onlyArchived && (
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
      )}
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
