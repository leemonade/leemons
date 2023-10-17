import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { capitalize, flatten, forEach, isArray, isFunction, map } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  ContextContainer,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Switch,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { SetupCoursesStyles } from './SetupCourses.styles';

export const SETUP_COURSES_DEFAULT_PROPS = {
  sharedData: {},
  frequencyOptions: [],
};
export const SETUP_COURSES_PROP_TYPES = {
  labels: PropTypes.object,
  placeholders: PropTypes.object,
  errorMessages: PropTypes.object,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  frequencyOptions: PropTypes.array,
  editable: PropTypes.bool,
};

const resets = {
  haveSubstagesPerCourse: [
    'substagesFrequency',
    'numberOfSubstages',
    'useDefaultSubstagesName',
    'maxSubstageAbbreviation',
    'maxSubstageAbbreviationIsOnlyNumbers',
    'customSubstages',
    'substages',
  ],
  useDefaultSubstagesName: [
    'maxSubstageAbbreviation',
    'maxSubstageAbbreviationIsOnlyNumbers',
    'substages',
  ],
};

const SetupCourses = ({
  labels,
  placeholders,
  errorMessages,
  onPrevious,
  onNext,
  sharedData,
  setSharedData,
  frequencyOptions,
  editable,
  ...props
}) => {
  const defaultValues = {
    onlyOneCourse: false,
    maxNumberOfCourses: 2,
    courseCredits: 0,
    haveSubstagesPerCourse: true,
    substagesFrequency: frequencyOptions[0]?.value,
    substages: [],
    numberOfSubstages: 1,
    useDefaultSubstagesName: false,
    maxSubstageAbbreviation: 2,
    maxSubstageAbbreviationIsOnlyNumbers: false,
    hideCoursesInTree: false,
    moreThanOneAcademicYear: false,
    ...sharedData,
  };

  const [useDefaultSubstagesName, setUseDefaultSubstagesName] = useState(
    defaultValues.useDefaultSubstagesName
  );
  const [maxSubstageAbbreviation, setMaxSubstageAbbreviation] = useState(
    defaultValues.maxSubstageAbbreviation
  );
  const [maxSubstageAbbreviationIsOnlyNumbers, setMaxSubstageAbbreviationIsOnlyNumbers] = useState(
    defaultValues.maxSubstageAbbreviationIsOnlyNumbers
  );
  const [substagesFrequencyLabel, setSubstagesFrequencyLabel] = useState(
    frequencyOptions[0]?.label
  );
  const [numberOfSubstages, setNumberOfSubstages] = useState(defaultValues.numberOfSubstages);

  const {
    watch,
    control,
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({ defaultValues });

  const onlyOneCourse = watch('onlyOneCourse');
  const maxNumberOfCourses = watch('maxNumberOfCourses') || 2;
  const haveSubstagesPerCourse = watch('haveSubstagesPerCourse');
  const abbrevationOnlyNumbers = watch('maxSubstageAbbreviationIsOnlyNumbers');
  const haveCycles = watch('haveCycles');
  const cycles = watch('cycles');
  const substagesFrequencyValue = watch('substagesFrequency');

  const { classes, cx } = SetupCoursesStyles({ onlyOneCourse }, { name: 'SetupCourses' });

  function getArrayOfNumbersCourses() {
    return map([...Array(maxNumberOfCourses).keys()], (a) => a + 1);
  }

  React.useEffect(() => {
    if (editable) {
      const existCourses = getArrayOfNumbersCourses();
      const finalCycles = [];
      forEach(cycles, (cycle) => {
        const courses = [...cycle.courses];
        forEach(courses, (course) => {
          if (!existCourses.includes(course)) {
            const index = courses.indexOf(course);
            courses.splice(index, 1);
          }
        });
        if (courses.length) {
          finalCycles.push({
            ...cycle,
            courses,
          });
        }
      });
      setValue('cycles', finalCycles);
    }
  }, [maxNumberOfCourses]);

  const coursesData = React.useMemo(() => {
    const usedCourses = flatten(map(cycles, 'courses'));
    const result = [];
    forEach(getArrayOfNumbersCourses(), (index) => {
      if (!usedCourses.includes(index)) {
        result.push({
          value: index,
          label: index,
        });
      }
    });
    return result;
  }, [maxNumberOfCourses, cycles]);

  useEffect(() => {
    const subscription = watch((formData, event) => {
      if (event.name === 'haveSubstagesPerCourse' && !formData.haveSubstagesPerCourse) {
        forEach(resets.haveSubstagesPerCourse, (reset) => {
          unregister(reset);
        });
      }
      if (event.name === 'useDefaultSubstagesName' && formData.useDefaultSubstagesName) {
        forEach(resets.useDefaultSubstagesName, (reset) => {
          unregister(reset);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getSubstageAbbr = (currentSubstage) => {
    let substageAbbr = `${currentSubstage}`;
    substageAbbr = substageAbbr.padStart(
      maxSubstageAbbreviationIsOnlyNumbers ? maxSubstageAbbreviation : maxSubstageAbbreviation - 1,
      '0'
    );
    substageAbbr =
      (maxSubstageAbbreviationIsOnlyNumbers
        ? ''
        : substagesFrequencyValue.charAt(0).toUpperCase()) + substageAbbr;

    return substageAbbr;
  };

  function getSubstages() {
    const substages = [];
    for (let currentSubstage = 0; currentSubstage < numberOfSubstages; currentSubstage++) {
      const defaultValue = getSubstageAbbr(currentSubstage + 1);
      // const substageName = `${capitalize(substagesFrequency)} ${currentSubstage + 1}`;
      const substageKey = `substages.${currentSubstage}`;
      const substageName = `substages.${currentSubstage}.name`;
      const substageAbbrev = `substages.${currentSubstage}.abbreviation`;

      substages.push(
        <ContextContainer key={substageKey} direction="row">
          <Controller
            name={substageName}
            control={control}
            rules={{
              required: errorMessages.useDefaultSubstagesName?.required || 'Required Field',
            }}
            render={({ field }) => (
              <TextInput
                label={`${capitalize(substagesFrequencyLabel)}`}
                error={isArray(errors.substages) ? errors.substages[currentSubstage]?.name : null}
                required
                disabled={!editable}
                {...field}
              />
            )}
          />
          <Controller
            name={substageAbbrev}
            control={control}
            rules={{
              validate: (value) => {
                if (abbrevationOnlyNumbers) {
                  if (!/^\d+$/.test(value)) {
                    return errorMessages.abbrevationOnlyNumbers || 'Only numbers allowed';
                  }
                }

                if (value.length > maxSubstageAbbreviation) {
                  return errorMessages.maximunSubstageAbbreviation
                    ? errorMessages.maximunSubstageAbbreviation.replace(
                        '{n}',
                        maxSubstageAbbreviation
                      )
                    : 'Maximum ' + maxSubstageAbbreviation + ' characters';
                }
              },
            }}
            defaultValue={defaultValue}
            render={({ field: { onChange, value, ...field }, fieldState }) => (
              <TextInput
                {...field}
                label={labels.abbreviation}
                value={value}
                onChange={onChange}
                error={
                  isArray(errors.substages) ? errors.substages[currentSubstage]?.abbreviation : null
                }
                required
                disabled={!editable}
              />
            )}
          />
        </ContextContainer>
      );
    }
    return substages;
  }

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };
    if (!data.haveSubstagesPerCourse) {
      forEach(resets.haveSubstagesPerCourse, (reset) => {
        delete data[reset];
      });
    }
    if (data.useDefaultSubstagesName) {
      forEach(resets.useDefaultSubstagesName, (reset) => {
        delete data[reset];
      });
    }

    isFunction(setSharedData) && setSharedData(data);
    isFunction(onNext) && onNext(data);
  };

  useEffect(() => {
    if (maxNumberOfCourses === 1 && !onlyOneCourse) {
      setValue('onlyOneCourse', true);
    }
  }, [maxNumberOfCourses, onlyOneCourse]);

  const tableConfig = React.useMemo(
    () => ({
      columns: [
        {
          Header: labels.cycleName,
          accessor: 'name',
          input: {
            node: <TextInput required />,
            rules: { required: labels.cycleNameRequired },
          },
        },
        {
          Header: labels.cycleCourses,
          accessor: 'courses',
          input: {
            node: <MultiSelect data={coursesData} />,
            rules: { required: labels.cycleCoursesRequired },
          },
          valueRender: (values) => (
            <>
              {values.map((v) => (
                <Badge closable={false}>{v}</Badge>
              ))}
            </>
          ),
        },
      ],
      labels: {
        add: labels.add,
        remove: labels.remove,
        edit: labels.edit,
        accept: labels.accept,
        cancel: labels.cancel,
      },
    }),
    [coursesData]
  );

  return (
    <form onSubmit={handleSubmit(handleOnNext)} autoComplete="off">
      <ContextContainer {...props} divided>
        <ContextContainer title={labels.title}>
          <Stack direction="column" className={classes.checkboxGroup}>
            <Controller
              name="onlyOneCourse"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  label={labels.oneCourseOnly}
                  checked={value}
                  onChange={(e) => {
                    onChange(e);
                    setValue('maxNumberOfCourses', e ? 1 : 2);
                    setValue('courseCredits', 0);
                    setValue('moreThanOneAcademicYear', false);
                    setValue('haveCycles', false);
                    setValue('cycles', []);
                  }}
                  disabled={!editable}
                  {...field}
                />
              )}
            />
            {/*
           <Controller
              name="hideCoursesInTree"
              control={control}
              render={({ field: { value, ...field } }) => (
                <Checkbox
                  label={labels.hideCoursesInTree}
                  checked={value}
                  disabled={!editable}
                  {...field}
                />
              )}
            />
            */}
            {!onlyOneCourse && (
              <Controller
                name="moreThanOneAcademicYear"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Checkbox
                    label={labels.moreThanOneAcademicYear}
                    checked={value}
                    disabled={!editable}
                    {...field}
                  />
                )}
              />
            )}
          </Stack>
          {!onlyOneCourse && (
            <ContextContainer direction="row">
              <Controller
                name="maxNumberOfCourses"
                control={control}
                rules={{ required: errorMessages.maxNumberOfCourses?.required }}
                render={({ field }) => (
                  <NumberInput
                    label={labels.maxNumberOfCourses}
                    defaultValue={2}
                    min={2}
                    disabled={!editable}
                    error={errors.maxNumberOfCourses}
                    {...field}
                  />
                )}
              />
              {defaultValues.credits ? (
                <Controller
                  name="courseCredits"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      label={labels.courseCredits}
                      // defaultValue={0}
                      min={0}
                      disabled={!editable}
                      {...field}
                    />
                  )}
                />
              ) : null}
            </ContextContainer>
          )}
        </ContextContainer>
        {!onlyOneCourse && (
          <ContextContainer title={labels.cycles}>
            <Controller
              name="haveCycles"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  onChange={() => {
                    field.onChange(!field.value);
                  }}
                  label={labels.haveCycles}
                  checked={!!field.value || false}
                  disabled={!editable}
                />
              )}
            />
            {haveCycles && (
              <Controller
                control={control}
                name="cycles"
                render={({ field }) => {
                  return (
                    <TableInput
                      {...tableConfig}
                      {...field}
                      disabled={!editable}
                      onChange={(e) => {
                        if (editable) field.onChange(e);
                      }}
                      data={field.value}
                      editable={false}
                      resetOnAdd
                      sortable={false}
                    />
                  );
                }}
              />
            )}
          </ContextContainer>
        )}
        <ContextContainer title={labels.courseSubstage}>
          <Controller
            name="haveSubstagesPerCourse"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                onChange={() => {
                  field.onChange(!field.value);
                  if (field.value) {
                    setValue('customSubstages', []);
                    setValue('numberOfSubstages', 1);
                    setValue('substagesFrequency', frequencyOptions[0]?.value);
                    setNumberOfSubstages(1);
                  }
                }}
                label={labels.haveSubstagesPerCourse}
                checked={!field.value || false}
                disabled={!editable}
              />
            )}
          />
          {haveSubstagesPerCourse ? (
            <ContextContainer>
              <ContextContainer direction="row">
                <Controller
                  name="substagesFrequency"
                  control={control}
                  rules={{ required: errorMessages.substagesFrequency?.required }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Select
                      label={labels.substagesFrequency}
                      placeholder={placeholders.substagesFrequency}
                      data={frequencyOptions}
                      onChange={(e) => {
                        onChange(e);
                        setSubstagesFrequencyLabel(
                          frequencyOptions.find((option) => option.value === e).label
                        );
                      }}
                      required
                      value={value}
                      disabled={!editable}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="numberOfSubstages"
                  control={control}
                  rules={{ required: errorMessages.numberOfSubstages?.required }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <NumberInput
                      label={labels.numberOfSubstages}
                      defaultValue={1}
                      min={1}
                      onChange={(e) => {
                        onChange(e);
                        setNumberOfSubstages(e);
                      }}
                      required
                      value={value}
                      disabled={!editable}
                      {...field}
                    />
                  )}
                />
              </ContextContainer>
              <ContextContainer subtitle={labels.subtagesNames}>
                <Controller
                  name="useDefaultSubstagesName"
                  control={control}
                  render={({ field: { onChange, value, ref, ...field } }) => (
                    <Switch
                      label={labels.useDefaultSubstagesName}
                      {...field}
                      onChange={(e) => {
                        onChange(e);
                        setUseDefaultSubstagesName(!useDefaultSubstagesName);
                      }}
                      checked={value || false}
                      disabled={!editable}
                    />
                  )}
                />

                {!useDefaultSubstagesName ? (
                  <>
                    <Controller
                      name="maxSubstageAbbreviation"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <ContextContainer direction="row" alignItems="end">
                          <NumberInput
                            {...field}
                            defaultValue={2}
                            min={2}
                            label={labels.maxSubstageAbbreviation}
                            onChange={(e) => {
                              console.log(e);
                              onChange(e);
                              setMaxSubstageAbbreviation(e);
                            }}
                            value={value}
                            disabled={!editable}
                          />

                          <Controller
                            name="maxSubstageAbbreviationIsOnlyNumbers"
                            control={control}
                            render={({ field: { onChange, value, ...field } }) => (
                              <Checkbox
                                label={labels.maxSubstageAbbreviationIsOnlyNumbers}
                                {...field}
                                onChange={(e) => {
                                  onChange(e);
                                  setMaxSubstageAbbreviationIsOnlyNumbers(
                                    !maxSubstageAbbreviationIsOnlyNumbers
                                  );
                                }}
                                checked={value}
                                disabled={!editable}
                              />
                            )}
                          />
                        </ContextContainer>
                      )}
                    />
                    {substagesFrequencyValue ? getSubstages() : null}
                  </>
                ) : null}
              </ContextContainer>
            </ContextContainer>
          ) : null}
        </ContextContainer>
        <Stack fullWidth justifyContent="space-between">
          <Box>
            <Button
              compact
              variant="light"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={onPrevious}
            >
              {labels.buttonPrev}
            </Button>
          </Box>
          <Box>
            <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
              {labels.buttonNext}
            </Button>
          </Box>
        </Stack>
      </ContextContainer>
    </form>
  );
};

SetupCourses.defaultProps = SETUP_COURSES_DEFAULT_PROPS;
SetupCourses.propTypes = SETUP_COURSES_PROP_TYPES;

export { SetupCourses };
