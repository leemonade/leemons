import React from 'react';
import PropTypes from 'prop-types';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { set, uniq } from 'lodash';

import {
  Box,
  Button,
  ContextContainer,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';

import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { SubjectPicker } from '@academic-portfolio/components/SubjectPicker';
import { ActivityDatesPicker } from './components/ActivityDatesPicker';
import { EvaluationType } from './components/EvaluationType';
import { GroupPicker } from './components/GroupPicker';
import { Instructions } from './components/Instructions';
import { OtherOptions } from './components/OtherOptions';
import useFormComponentStyles from './FormComponent.styles';
import Presentation from './components/Presentation/Presentation';
import Preview from './components/Preview/Preview';

function onSubmitFunc(onSubmit, evaluationType, values) {
  const allowedTypes = ['auto', 'manual', 'none'];
  const finalEvaluationType = allowedTypes.includes(evaluationType) ? evaluationType : 'manual';

  const submissionValues = {
    /*
      === Students ===
    */
    students: uniq(values.students.value.flatMap((group) => group.students)),
    classes: uniq(values.students.value.flatMap((group) => group.group)),
    addNewClassStudents: !!values.students.autoAssign,

    /*
      === Dates ====
    */
    alwaysAvailable: values.dates.alwaysAvailable,
    dates: {
      ...values.dates.dates,
    },
    duration: values.dates.maxTime,

    /*
      === Evaluation ===
    */
    gradable: values.evaluation.evaluation.gradable,
    requiresScoring: values.evaluation.evaluation.requiresScoring,
    allowFeedback: values.evaluation.evaluation.allowFeedback,
    curriculum: Object.fromEntries(
      (values.evaluation.curriculum || []).map((category) => [category, true])
    ),

    /*
      === Others ===
    */
    sendMail: values.others.notifyStudents,
    messageToAssignees: values.others.message,
    showResults: !values.others.hideReport,
    showCorrectAnswers: !values.others.hideResponses,

    metadata: {
      evaluationType: finalEvaluationType,
    },
  };

  if (values.instructions) {
    set(submissionValues, 'metadata.statement', values.instructions);
  }

  if (values.students.value[0]?.name) {
    set(submissionValues, 'metadata.groupName', values.students.value[0]?.name);
    set(
      submissionValues,
      'metadata.showGroupNameToStudents',
      values.students.value[0]?.showToStudents
    );
  }

  if (!values.dates.hideFromCalendar) {
    submissionValues.dates.visualization = new Date();
  }
  if (values.others.teacherDeadline) {
    submissionValues.dates.correctionDeadline = values.others.teacherDeadline;
  }

  onSubmit({ value: submissionValues, raw: values });
}

/**
 *
 * @param {object} props
 * @param {'manual' | 'auto' | 'none'} props.evaluationType
 * @returns
 */
export default function Form({
  onPrevStep,
  onNextStep,
  hasPrevStep,
  hasNextStep,

  assignable,
  loading,
  localizations,
  evaluationType,
  evaluationTypes,
  hideMaxTime,
  hideSectionHeaders,
  onlyOneSubject,
  onSubmit,
  showTitle,
  showThumbnail,
  showEvaluation,
  showInstructions,
  showMessageForStudents,
  showReport,
  showResponses,

  scrollRef,

  defaultValues,
}) {
  const form = useForm({
    defaultValues,
  });
  const { control, handleSubmit } = form;

  const submitHandler = React.useCallback(
    (...props) => onSubmitFunc(onSubmit, evaluationType, ...props),
    [onSubmit, evaluationType]
  );

  const { classes } = useFormComponentStyles();

  return (
    <form
      onSubmit={handleSubmit((...props) => {
        submitHandler(...props);
        onNextStep();
      })}
    >
      <FormProvider {...form}>
        <TotalLayoutStepContainer
          ref={scrollRef}
          Footer={
            <TotalLayoutFooterContainer
              scrollRef={scrollRef}
              fixed
              leftZone={
                hasPrevStep && (
                  <Button
                    variant="outline"
                    leftIcon={<ChevLeftIcon />}
                    onClick={handleSubmit((...props) => {
                      submitHandler(...props);
                      onPrevStep();
                    })}
                  >
                    {localizations?.buttons?.previous}
                  </Button>
                )
              }
              rightZone={
                <Button
                  type="submit"
                  rightIcon={hasNextStep ? <ChevRightIcon /> : null}
                  loading={!!loading}
                >
                  {hasNextStep ? localizations?.buttons?.next : localizations?.buttons?.assign}
                </Button>
              }
            />
          }
        >
          <Box className={classes.root}>
            <Box className={classes.leftColumn}>
              <Presentation
                localizations={localizations?.presentation}
                showTitle={showTitle}
                showThumbnail={showThumbnail}
              />
              {!!showInstructions && (
                <Controller
                  name="instructions"
                  control={control}
                  render={({ field }) => (
                    <Instructions
                      {...field}
                      localizations={localizations?.instructions}
                      hideSectionHeaders={hideSectionHeaders}
                    />
                  )}
                />
              )}
              <Box mb={30}>
                <Controller
                  name="subjects"
                  control={control}
                  rules={{
                    required: true,
                    minLength: 1,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <SubjectPicker
                      {...field}
                      error={error}
                      assignable={assignable}
                      localizations={localizations?.subjects}
                      hideSectionHeaders={hideSectionHeaders}
                      onlyOneSubject={onlyOneSubject}
                      selectInitialSubjects
                    />
                  )}
                />
              </Box>
              <Controller
                name="students"
                control={control}
                rules={{
                  required: true,
                  validate: (value) => value?.value?.length > 0,
                }}
                render={({ field, fieldState: { error } }) => (
                  <GroupPicker
                    {...field}
                    localizations={localizations?.groups}
                    error={error}
                    hideSectionHeaders={hideSectionHeaders}
                  />
                )}
              />
              <Controller
                name="dates"
                control={control}
                rules={{
                  required: true,
                  validate: (value) =>
                    value.alwaysAvailable || !!(value.dates?.start && value.dates?.deadline),
                }}
                render={({ field, fieldState: { error } }) => (
                  <ActivityDatesPicker
                    {...field}
                    localizations={localizations?.dates}
                    error={error}
                    hideMaxTime={hideMaxTime}
                    hideSectionHeaders={hideSectionHeaders}
                  />
                )}
              />
              <Controller
                name="evaluation"
                control={control}
                render={({ field }) => (
                  <EvaluationType
                    {...field}
                    evaluationTypes={evaluationTypes}
                    assignable={assignable}
                    hidden={!showEvaluation}
                    localizations={localizations?.evaluation}
                    hideSectionHeaders={hideSectionHeaders}
                  />
                )}
              />
              <Controller
                name="others"
                control={control}
                rules={{
                  validate: (value) => !value.useTeacherDeadline || !!value.teacherDeadline,
                }}
                render={({ field, fieldState: { error } }) => (
                  <OtherOptions
                    {...field}
                    error={error}
                    assignable={assignable}
                    localizations={localizations?.others}
                    showReport={showReport}
                    showResponses={showResponses}
                    showMessageForStudents={showMessageForStudents}
                    hideSectionHeaders={hideSectionHeaders}
                  />
                )}
              />
            </Box>
            <Box className={classes.rightColumn}>
              <Preview assignable={assignable} localizations={localizations?.preview} />
            </Box>
          </Box>
        </TotalLayoutStepContainer>
      </FormProvider>
    </form>
  );
}

Form.propTypes = {
  scrollRef: PropTypes.object,
  onNextStep: PropTypes.func,
  onPrevStep: PropTypes.func,
  hasNextStep: PropTypes.bool,
  hasPrevStep: PropTypes.bool,

  loading: PropTypes.bool,
  localizations: PropTypes.object,
  assignable: PropTypes.object,
  buttonsComponent: PropTypes.node,
  defaultValues: PropTypes.object,
  evaluationType: PropTypes.oneOf(['manual', 'auto', 'none']).isRequired,
  evaluationTypes: PropTypes.arrayOf('string'),
  hideMaxTime: PropTypes.bool,
  hideSectionHeaders: PropTypes.bool,
  onlyOneSubject: PropTypes.bool,
  onSubmit: PropTypes.func,
  showTitle: PropTypes.bool,
  showThumbnail: PropTypes.bool,
  showEvaluation: PropTypes.bool,
  showInstructions: PropTypes.bool,
  showMessageForStudents: PropTypes.bool,
  showReport: PropTypes.bool,
  showResponses: PropTypes.bool,
};
