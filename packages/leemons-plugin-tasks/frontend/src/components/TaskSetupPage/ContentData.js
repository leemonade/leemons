// Libraries
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  InputWrapper,
  Stack,
  TabPanel,
  Tabs,
  SegmentedControl,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@common/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { isFunction, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

// Leemons plugins
import useSubjects from '@assignables/components/Assignment/AssignStudents/hooks/useSubjects';

// Local files
import Attachments from './components/Attachments';
import Curriculum from './components/Curriculum';
import Objectives from './components/Objectives';
import Submissions from './components/Submissions';
import StatementImage from './components/StatementImage';
import Development from './components/Development';

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

  const [curriculumTab, setCurriculumTab] = React.useState(0);

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
          ...e.metadata,
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
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <ContextContainer {...props} divided>
          <ContextContainer divided>
            <ContextContainer title={labels?.statementAndDevelopmentTitle}>
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
              <StatementImage labels={labels} />
              <Development
                label={labels.development}
                placeholder={placeholders.development}
                name="metadata.development"
              />
            </ContextContainer>

            <ContextContainer title={labels?.attachmentsTitle}>
              <Attachments labels={labels} />
            </ContextContainer>

            <ContextContainer title={labels.subjects}>
              {subjects?.length > 1 && (
                <SegmentedControl
                  data={subjects?.map((subject, i) => ({ value: i, label: subject.label }))}
                  value={`${curriculumTab}`}
                  onChange={(value) => setCurriculumTab(Number(value))}
                />
              )}

              {
                <Box className={classes.tabPane}>
                  <ContextContainer>
                    <Controller
                      control={control}
                      name="program"
                      render={({ field: { value: program } }) => (
                        <Curriculum
                          addLabel={labels?.addFromCurriculum}
                          program={program}
                          subjects={subjects[curriculumTab]?.value}
                          name={`curriculum.${subjects[curriculumTab]?.value}.curriculum`}
                          type="curriculum"
                        />
                      )}
                    />
                    <Objectives
                      name={`curriculum.${subjects[curriculumTab]?.value}.objectives`}
                      label={labels.objectives || ''}
                      error={errors.objectives}
                    />
                  </ContextContainer>
                </Box>
              }
              {/* {!!subjects?.length && (
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
                                  addLabel={labels?.addFromCurriculum}
                                  program={program}
                                  subjects={subject.value}
                                  name={`curriculum.${subject.value}.curriculum`}
                                  type="curriculum"
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
              )} */}
            </ContextContainer>

            <ContextContainer title={labels?.submission?.title}>
              {/* <Methodology
                labels={labels}
                errorMessages={errorMessages}
                placeholders={placeholders}
              /> */}

              {/* <Controller
                name="gradable"
                control={control}
                render={({ field }) => (
                  <Switch label={labels?.submission?.gradable} {...field} checked={field.value} />
                )}
              /> */}
              <Submissions labels={labels} errorMessages={errorMessages} />
            </ContextContainer>
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
              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleSubmit(handleOnNext)}
              >
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
