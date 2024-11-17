import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  ColorInput,
  ContextContainer,
  InputWrapper,
  NumberInput,
  Paragraph,
  Stack,
  Switch,
  TextInput,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { SetupBasicDataStyles } from './SetupBasicData.styles';

export const SETUP_BASIC_DATA_DEFAULT_PROPS = {
  sharedData: {},
};
export const SETUP_BASIC_DATA_PROP_TYPES = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  onNext: PropTypes.func,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
};

const SetupBasicData = ({
  labels,
  descriptions,
  placeholders,
  helps,
  errorMessages,
  onNext,
  evaluationSystemSelect,
  onPrevious,
  sharedData,
  setSharedData,
  editable,
  ImagePicker,
  ...props
}) => {
  const { classes, cx } = SetupBasicDataStyles({}, { name: 'APBasicData' });

  const options = {};
  if (sharedData && sharedData.credits) {
    options.useCreditSystem = true;
  }

  const defaultValues = {
    name: '',
    abbreviation: '',
    color: '',
    credits: 0,
    maxGroupAbbreviation: 2,
    maxGroupAbbreviationIsOnlyNumbers: false,
    creditSystem: false,
    oneStudentGroup: false,
    useCreditSystem: false,
    useOneStudentGroup: false,
    evaluationSystem: '',
    totalHours: 0,
    hideStudentsToStudents: false,
    ...sharedData,
    ...options,
  };

  const [creditSystem, setCreditSystem] = useState(defaultValues.useCreditSystem);
  const [oneStudentGroup, setOneStudentGroup] = useState(defaultValues.useOneStudentGroup);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
    setCreditSystem(defaultValues.useCreditSystem);
  }, [JSON.stringify(sharedData)]);

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };
    isFunction(setSharedData) && setSharedData(data);
    isFunction(onNext) && onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(handleOnNext)} autoComplete="off">
      <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
        <ContextContainer {...props} divided>
          <ContextContainer title={labels.title}>
            <ContextContainer direction="row" fullWidth>
              <Box>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: errorMessages.name?.required || 'Required Field' }}
                  render={({ field }) => (
                    <TextInput
                      label={labels.name}
                      placeholder={placeholders.name}
                      help={helps.name}
                      error={errors.name}
                      required
                      {...field}
                    />
                  )}
                />
              </Box>
              <Box>
                <Controller
                  control={control}
                  name="abbreviation"
                  rules={{
                    required: errorMessages.abbreviation?.required || 'Required Field',
                    maxLength: 8,
                    minLength: 1,
                  }}
                  render={({ field }) => (
                    <TextInput
                      label={labels.abbreviation}
                      placeholder={placeholders.abbreviation}
                      help={helps.abbreviation}
                      error={errors.abbreviation}
                      maxLength={8}
                      required
                      {...field}
                    />
                  )}
                />
              </Box>
            </ContextContainer>

            <Box>
              {ImagePicker && (
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <InputWrapper label={labels.image}>
                      <ImagePicker {...field} />
                    </InputWrapper>
                  )}
                />
              )}
            </Box>

            <Box>
              <Controller
                control={control}
                name="color"
                render={({ field }) => <ColorInput label={labels.color} {...field} />}
              />
            </Box>
          </ContextContainer>
          {evaluationSystemSelect ? (
            <ContextContainer title={labels.evaluationSystem}>
              <Controller
                name="evaluationSystem"
                control={control}
                rules={{
                  required: errorMessages.evaluationSystem?.required || 'Required Field',
                }}
                render={({ field }) =>
                  React.cloneElement(evaluationSystemSelect, {
                    ...field,
                    error: errors.evaluationSystem,
                    required: true,
                    disabled: !editable,
                  })
                }
              />
            </ContextContainer>
          ) : null}

          <ContextContainer title={labels.creditsTitle}>
            <ContextContainer direction="row">
              <Controller
                name="totalHours"
                control={control}
                render={({ field }) => (
                  <NumberInput defaultValue={0} min={0} label={labels.totalHours} {...field} />
                )}
              />
              <Box></Box>
            </ContextContainer>

            <Controller
              name="useCreditSystem"
              control={control}
              render={({ field: { onChange, value, ref, ...field } }) => (
                <Switch
                  label={labels.creditSystem}
                  disabled={!editable}
                  onChange={(e) => {
                    onChange(e);
                    setCreditSystem(!creditSystem);
                  }}
                  checked={value}
                  {...field}
                />
              )}
            />
            {creditSystem && (
              <>
                <ContextContainer direction="row">
                  <Controller
                    name="credits"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        disabled={!editable}
                        defaultValue={0}
                        min={0}
                        label={labels.credits}
                        {...field}
                      />
                    )}
                  />
                  <Box></Box>
                </ContextContainer>
              </>
            )}
          </ContextContainer>
          <ContextContainer title={labels.groupsIDAbbrev} spacing={4}>
            <Controller
              name="useOneStudentGroup"
              control={control}
              render={({ field: { onChange, value, ref, ...field } }) => (
                <Switch
                  label={labels.oneStudentGroup}
                  disabled={!editable}
                  onChange={(e) => {
                    onChange(e);
                    setOneStudentGroup(!oneStudentGroup);
                  }}
                  checked={value || false}
                  {...field}
                />
              )}
            />
            {!oneStudentGroup && (
              <>
                <Paragraph>{descriptions.maxGroupAbbreviation}</Paragraph>

                <Controller
                  name="maxGroupAbbreviation"
                  control={control}
                  rules={{
                    required: errorMessages.maxGroupAbbreviation?.required || 'Required Field',
                    min: 2,
                  }}
                  render={({ field }) => (
                    <ContextContainer direction="row" alignItems="center">
                      <NumberInput
                        defaultValue={2}
                        min={2}
                        label={labels.maxGroupAbbreviation}
                        help={helps.maxGroupAbbreviation}
                        required
                        disabled={!editable}
                        {...field}
                      />
                      <Controller
                        name="maxGroupAbbreviationIsOnlyNumbers"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <Checkbox
                            label={labels.maxGroupAbbreviationIsOnlyNumbers}
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
              </>
            )}
          </ContextContainer>

          <ContextContainer title={labels.privacy} spacing={4}>
            <Controller
              name="hideStudentsToStudents"
              control={control}
              render={({ field: { value, ref, ...field } }) => (
                <Switch label={labels.hideStudentsToStudents} checked={value || false} {...field} />
              )}
            />
          </ContextContainer>

          <Stack fullWidth justifyContent="end">
            <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
              {labels.buttonNext}
            </Button>
          </Stack>
        </ContextContainer>
      </Box>
    </form>
  );
};

SetupBasicData.defaultProps = SETUP_BASIC_DATA_DEFAULT_PROPS;
SetupBasicData.propTypes = SETUP_BASIC_DATA_PROP_TYPES;

export { SetupBasicData };
