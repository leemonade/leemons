// Libraries
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  Stack,
  SegmentedControl,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@common/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { isFunction, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

// Leemons plugins
import useSubjects from '@assignables/components/Assignment/AssignStudents/hooks/useSubjects';

// Local files
import { useObservableContext } from '@common/context/ObservableContext';
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

function useDefaultValues() {
  const { getValues } = useObservableContext();

  return useMemo(
    () => ({
      gradable: false,
      ...getValues('sharedData'),
    }),
    []
  );
}

function useSubjectsWrapper() {
  const { useWatch } = useObservableContext();

  const subjects = useWatch({ name: 'sharedData.subjects' });

  return useSubjects({ subjects }, false);
}

function ContentData({
  labels,
  placeholders,
  descriptions,
  helps,
  errorMessages,
  editable,
  onNext,
  onPrevious,
  useObserver,
  ...props
}) {
  const { useWatch, getValues, setValue } = useObservableContext();

  const isExpress = !!useWatch({ name: 'isExpress' });
  // ·······························································
  // FORM

  const { classes } = ContentDataStyles();

  const [curriculumTab, setCurriculumTab] = React.useState(0);

  const defaultValues = useDefaultValues();
  const formData = useForm({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = formData;

  const subjects = useSubjectsWrapper();

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const [loading, setLoading] = React.useState(null);

  const onSubmit = useCallback(
    (e) => {
      const sharedData = getValues('sharedData');

      setValue('sharedData', {
        ...sharedData,
        ...e,
        metadata: {
          ...sharedData.metadata,
          ...e.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'contentData']),
        },
      });
    },
    [getValues, setValue]
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
      } else if (event === 'saveTaskFailed') {
        setLoading(false);
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
  }, [isDirty, onSubmit, emitEvent, handleSubmit, subscribe, unsubscribe]);

  // ·······························································
  // HANDLERS

  const handleOnPrev = () => {
    if (!isDirty) {
      onPrevious();

      return;
    }

    handleSubmit((values) => {
      onSubmit(values);

      if (isFunction(onPrevious)) onPrevious();
    })();
  };

  const handleOnNext = (e) => {
    onSubmit(e);

    if (isFunction(onNext)) onNext();
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
                render={({ field }) => (
                  <TextEditorInput {...field} label={labels.statement} error={errors.statement} />
                )}
              />
              <StatementImage labels={labels} />
              {!isExpress && (
                <Development
                  label={labels.development}
                  placeholder={placeholders.development}
                  name="metadata.development"
                />
              )}
            </ContextContainer>

            <ContextContainer title={labels?.attachmentsTitle}>
              <Attachments labels={labels} />
            </ContextContainer>

            {!isExpress && !!subjects.length && (
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
              </ContextContainer>
            )}

            <ContextContainer title={labels?.submission?.title}>
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
              <ContextContainer direction="row">
                {isExpress && (
                  <Button
                    loading={loading === 'onlyPublish'}
                    variant="outline"
                    onClick={() => {
                      setLoading('onlyPublish');
                      emitEvent('publishTaskAndLibrary');
                    }}
                  >
                    {labels.buttonPublish}
                  </Button>
                )}

                {isExpress && (
                  <Button
                    loading={loading === 'publishAndAssign'}
                    onClick={() => {
                      setLoading('publishAndAssign');
                      emitEvent('publishTaskAndAssign');
                    }}
                  >
                    {labels.buttonPublishAndAssign}
                  </Button>
                )}
                {!isExpress && (
                  <Button
                    rightIcon={<ChevRightIcon height={20} width={20} />}
                    onClick={handleSubmit(handleOnNext)}
                  >
                    {labels.buttonNext}
                  </Button>
                )}
              </ContextContainer>
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
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  useObserver: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ContentData };
