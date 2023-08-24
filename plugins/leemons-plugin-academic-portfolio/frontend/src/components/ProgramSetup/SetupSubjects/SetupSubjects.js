import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, find, findIndex, isFunction } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  ContextContainer,
  Divider,
  NumberInput,
  Select,
  Stack,
  Switch,
  TableInput,
  Text,
  TextInput,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { SetupSubjectsStyles } from './SetupSubjects.styles';

export const SETUP_SUBJECTS_DEFAULT_PROPS = {
  sharedData: {},
  errorMessages: {},
  firstDigitOptions: [],
  frequencyOptions: [],
};
export const SETUP_SUBJECTS_PROP_TYPES = {
  labels: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  firstDigitOptions: PropTypes.array,
  frequencyOptions: PropTypes.array,
  editable: PropTypes.bool,
};

const SetupSubjects = ({
  labels,
  helps,
  errorMessages,
  onNext,
  onPrevious,
  sharedData,
  setSharedData,
  firstDigitOptions: _firstDigitOptions,
  frequencyOptions,
  editable,
  ...props
}) => {
  let firstDigitOptions = cloneDeep(_firstDigitOptions);

  if (sharedData.maxNumberOfCourses <= 1) {
    const index = findIndex(firstDigitOptions, { value: 'course' });
    if (index >= 0) {
      firstDigitOptions.splice(index, 1);
    }
  }

  const defaultValues = {
    allSubjectsSameDuration: false,
    haveKnowledge: false,
    maxKnowledgeAbbreviation: 2,
    maxKnowledgeAbbreviationIsOnlyNumbers: false,
    subjectsFirstDigit: firstDigitOptions[0]?.value,
    subjectsDigits: 2,
    customSubstages: [],
    ...sharedData,
  };

  const [subjectsFirstDigit, setSubjectsFirstDigit] = useState(defaultValues.subjectsFirstDigit);
  const [subjectsDigits, setSubjectsDigits] = useState(defaultValues.subjectsDigits);
  const [allSubjectsSameDuration, setAllSubjectsSameDuration] = useState(
    defaultValues.allSubjectsSameDuration
  );
  const [haveKnowledge, setHaveKnowledge] = useState(defaultValues.haveKnowledge);
  const [customSubstages, setCustomSubstages] = useState(defaultValues.customSubstages);

  const { classes, cx } = SetupSubjectsStyles({});

  const generateSubjectsID = useCallback(() => {
    if (!subjectsDigits) return '';
    const subjectsID = [];
    const numberOfCourses = sharedData?.maxNumberOfCourses;

    for (let currentNumber = 1; currentNumber <= numberOfCourses; currentNumber++) {
      const firstNumber = subjectsFirstDigit !== 'none' ? currentNumber : '';
      subjectsID.push(
        <Box key={`k-${currentNumber}`} className={classes.subjectID}>
          <Text size="md">{`${firstNumber}${'0'.repeat(
            subjectsDigits - 1
          )}1-${firstNumber}${'9'.repeat(subjectsDigits)}`}</Text>
        </Box>
      );
      if (currentNumber < numberOfCourses) {
        subjectsID.push(<Divider key={`d-${currentNumber}`} orientation="vertical" />);
      }
    }
    return subjectsID;
  }, [subjectsFirstDigit, subjectsDigits, sharedData, firstDigitOptions]);

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const haveSubstagesPerCourse = watch('haveSubstagesPerCourse');

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e, customSubstages };
    isFunction(setSharedData) && setSharedData(data);
    isFunction(onNext) && onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(handleOnNext)} autoComplete="off">
      <ContextContainer {...props} divided>
        {false ? (
          <>
            {!!haveSubstagesPerCourse && (
              <ContextContainer title={labels.title} subtitle={labels.standardDuration}>
                <Controller
                  name="allSubjectsSameDuration"
                  control={control}
                  render={({ field: { onChange, value, ref, ...field } }) => (
                    <Switch
                      label={labels.allSubjectsSameDuration}
                      help={helps.allSubjectsSameDuration}
                      onChange={(e) => {
                        setAllSubjectsSameDuration(!allSubjectsSameDuration);
                        onChange(e);
                      }}
                      checked={value || false}
                      disabled={!editable}
                      {...field}
                    />
                  )}
                />
                {!allSubjectsSameDuration && (
                  <TableInput
                    sortable={false}
                    disabled={!editable}
                    columns={[
                      {
                        Header: labels.periodName,
                        accessor: 'name',
                        input: {
                          node: <TextInput />,
                          rules: {
                            required: errorMessages?.periodName?.required || 'Required field',
                          },
                        },
                      },
                      {
                        Header: labels.numOfPeriods,
                        accessor: 'number',
                        input: {
                          node: <NumberInput />,
                          rules: {
                            required: errorMessages?.numOfPeriods?.required || 'Required field',
                          },
                        },
                      },
                      {
                        Header: labels.substagesFrequency,
                        accessor: 'frequency',
                        input: {
                          node: <Select />,
                          rules: {
                            required:
                              errorMessages?.substagesFrequency?.required || 'Required field',
                          },
                          data: frequencyOptions,
                        },
                        valueRender: (value) => {
                          const item = find(frequencyOptions, { value });
                          return item ? item.label : value;
                        },
                      },
                    ]}
                    data={customSubstages}
                    labels={{
                      add: labels.buttonAdd,
                      remove: labels.buttonRemove,
                    }}
                    onChangeData={(val) => setCustomSubstages(val)}
                  />
                )}
              </ContextContainer>
            )}
          </>
        ) : null}

        <ContextContainer title={labels.knowledgeAreas}>
          <Controller
            name="haveKnowledge"
            control={control}
            render={({ field: { onChange, value, ref, ...field } }) => (
              <Switch
                label={labels.haveKnowledge}
                help={helps.haveKnowledge}
                onChange={(e) => {
                  setHaveKnowledge(!haveKnowledge);
                  onChange(e);
                }}
                checked={value || false}
                disabled={!editable}
                {...field}
              />
            )}
          />
          {haveKnowledge ? (
            <Controller
              name="maxKnowledgeAbbreviation"
              control={control}
              rules={{ min: 2 }}
              render={({ field }) => (
                <ContextContainer direction="row" alignItems="center">
                  <NumberInput
                    label={labels.maxKnowledgeAbbreviation}
                    help={helps.maxKnowledgeAbbreviation}
                    defaultValue={2}
                    min={2}
                    disabled={!editable}
                    {...field}
                  />
                  <Controller
                    name="maxKnowledgeAbbreviationIsOnlyNumbers"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <Checkbox
                        label={labels.maxKnowledgeAbbreviationIsOnlyNumbers}
                        onChange={onChange}
                        checked={value}
                        disabled={!editable}
                        {...field}
                      />
                    )}
                  />
                </ContextContainer>
              )}
            />
          ) : null}
        </ContextContainer>
        <ContextContainer title={labels.subjectsIDConfig}>
          <ContextContainer direction="row" alignItems="center">
            <Controller
              name="subjectsFirstDigit"
              control={control}
              render={({ field: { onChange, ...field } }) => (
                <Select
                  data={firstDigitOptions}
                  label={labels.subjectsFirstDigit}
                  onChange={(e) => {
                    onChange(e);
                    setSubjectsFirstDigit(e);
                  }}
                  disabled={!editable}
                  {...field}
                  value={subjectsFirstDigit}
                />
              )}
            />
            <Box className={classes.mathSymbol}>
              <Text color={'primary'} size={'xl'}>
                +
              </Text>
            </Box>
            <Controller
              name="subjectsDigits"
              control={control}
              rules={{ min: 2 }}
              render={({ field: { onChange, ...field } }) => (
                <NumberInput
                  label={labels.subjectsDigits}
                  defaultValue={2}
                  min={2}
                  disabled={!editable}
                  onChange={(e) => {
                    onChange(e);
                    setSubjectsDigits(e);
                  }}
                  {...field}
                />
              )}
            />
            <Box className={classes.mathSymbol}>
              <Text color={'primary'} size={'xl'}>
                =
              </Text>
            </Box>
            <Box className={classes.subjectsID}>{generateSubjectsID()}</Box>
          </ContextContainer>
        </ContextContainer>
        <Stack justifyContent="space-between" fullWidth>
          <Button
            compact
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={onPrevious}
          >
            {labels.buttonPrev}
          </Button>

          <Button type="submit">{labels.buttonNext}</Button>
        </Stack>
      </ContextContainer>
    </form>
  );
};

SetupSubjects.defaultProps = SETUP_SUBJECTS_DEFAULT_PROPS;
SetupSubjects.propTypes = SETUP_SUBJECTS_PROP_TYPES;

export { SetupSubjects };
