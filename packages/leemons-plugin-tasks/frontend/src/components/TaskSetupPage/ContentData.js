import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isFunction, uniq } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Stack,
  ContextContainer,
  Button,
  Tabs,
  TabPanel,
  InputWrapper,
  createStyles,
  Switch,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import useSubjects from '@assignables/components/Assignment/AssignStudents/hooks/useSubjects';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';
// import SelfReflection from './components/SelfReflection';
import Submissions from './components/Submissions';
import Objectives from './components/Objectives';
// import Contents from './components/Contents';
// import AssessmentCriteria from './components/AssessmentCriteria';
// import Attachments from './components/Attachments';
import Methodology from './components/Methodology';
import Curriculum from './components/Curriculum';

const ContentDataStyles = createStyles((theme) => ({
  tabPane: {
    paddingTop: theme.spacing[5],
    paddingLeft: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

function ContentData({
  labels,
  placeholders,
  descriptions,
  helps,
  errorMessages,
  sharedData,
  setSharedData,
  editable,
  onNext,
  onPrevious,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const { classes } = ContentDataStyles();

  const defaultValues = {
    gradable: false,
    ...sharedData,
  };

  const formData = useForm({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = formData;

  const subjects = useSubjects(sharedData);

  const { subscribe, unsubscribe, emitEvent } = useObserver();
  const onSubmit = useCallback(
    (e) => {
      const data = {
        ...sharedData,
        ...e,
        metadata: {
          ...sharedData.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'contentData']),
        },
      };
      setSharedData(data);

      return data;
    },
    [setSharedData, sharedData]
  );
  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit(
          (data) => {
            onSubmit(data);
            emitEvent('saveData');
          },
          () => {
            emitEvent('saveTaskFailed');
          }
        )();
      } else if (event === 'saveStep') {
        if (!isDirty) {
          emitEvent('stepSaved');
        } else {
          handleSubmit(
            (data) => {
              onSubmit(data);
              emitEvent('stepSaved');
            },
            () => {
              emitEvent('saveStepFailed');
            }
          )();
        }
      }
    };
    subscribe(f);

    return () => unsubscribe(f);
  }, [isDirty, setSharedData, emitEvent, handleSubmit, subscribe, unsubscribe]);

  // ·······························································
  // HANDLERS

  const handleOnPrev = () => {
    if (!isDirty) {
      onPrevious(sharedData);

      return;
    }

    handleSubmit((values) => {
      const data = { ...sharedData, ...values };
      if (isFunction(setSharedData)) setSharedData(data);
      if (isFunction(onPrevious)) onPrevious(data);
    })();
  };

  const handleOnNext = (e) => {
    const data = onSubmit(e);

    if (isFunction(onNext)) onNext(data);
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <FormProvider {...formData}>
      <form onSubmit={handleSubmit(handleOnNext)} autoComplete="off">
        <ContextContainer {...props} divided>
          <ContextContainer divided>
            {/* <Attachments /> */}

            <ContextContainer title={labels?.statementAndDevelopmentTitle}>
              {/* TODO: Make the statement required (Not allowed with TextEditor) */}
              <Controller
                control={control}
                name="statement"
                rules={{
                  required: errorMessages.statement?.required,
                }}
                render={({ field }) => (
                  <TextEditorInput
                    required
                    {...field}
                    label={labels.statement}
                    error={errors.statement}
                  />
                )}
              />
              <Controller
                control={control}
                name="development"
                render={({ field }) => (
                  <TextEditorInput
                    {...field}
                    label={labels.development}
                    placeholder={placeholders.development}
                    error={errors.development}
                  />
                )}
              />
            </ContextContainer>

            <ContextContainer title={labels.subjects}>
              {!!subjects?.length && (
                <InputWrapper required>
                  <Tabs>
                    {subjects?.map((subject, index) => (
                      <TabPanel key={index} label={subject?.label}>
                        <Box className={classes.tabPane}>
                          <ContextContainer>
                            <Controller
                              control={control}
                              name="program"
                              render={({ field: { value: program } }) => (
                                <Curriculum
                                  label={labels?.content || ''}
                                  addLabel={labels?.addFromCurriculum}
                                  program={program}
                                  name={`curriculum.${subject.value}.contents`}
                                  type="content"
                                />
                              )}
                            />
                            <Controller
                              control={control}
                              name="program"
                              render={({ field: { value: program } }) => (
                                <Curriculum
                                  label={labels?.assessmentCriteria || ''}
                                  addLabel={labels?.addFromCurriculum}
                                  program={program}
                                  name={`curriculum.${subject.value}.assessmentCriteria`}
                                  type="assessmentCriteria"
                                />
                              )}
                            />
                            <Objectives
                              name={`curriculum.${subject.value}.objectives`}
                              label={labels.objectives || ''}
                              error={errors.objectives}
                            />
                          </ContextContainer>
                        </Box>
                      </TabPanel>
                    ))}
                  </Tabs>
                </InputWrapper>
              )}
            </ContextContainer>

            <ContextContainer>
              {/* <Methodology
                labels={labels}
                errorMessages={errorMessages}
                placeholders={placeholders}
              /> */}
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <TimeUnitsInput
                    {...field}
                    label={labels.recommendedDuration}
                    error={errors.recommendedDuration}
                  />
                )}
              />
              <Controller
                name="gradable"
                control={control}
                render={({ field }) => (
                  <Switch label={labels?.gradable} {...field} checked={field.value} />
                )}
              />
            </ContextContainer>
            <Submissions labels={labels} />
            {/* <SelfReflection
              labels={labels?.selfReflection}
              description={descriptions?.selfReflection}
              showType
              name="selfReflection"
            /> */}
            {/* <SelfReflection
              labels={labels?.feedback}
              description={descriptions?.feedback}
              name="feedback"
            /> */}
          </ContextContainer>
          <Stack fullWidth justifyContent="space-between">
            <Box>
              <Button
                compact
                variant="light"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={handleOnPrev}
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
    </FormProvider>
  );
}

ContentData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
ContentData.propTypes = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  useObserver: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ContentData };
