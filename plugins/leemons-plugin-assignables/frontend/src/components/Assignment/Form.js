import React from 'react';
import PropTypes from 'prop-types';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { get, set, uniq } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { unflatten } from '@common';
import { Layout } from './components/Layout';
import { SubjectPicker } from './components/SubjectPicker';
import { GroupPicker } from './components/GroupPicker';
import { ActivityDatesPicker } from './components/ActivityDatesPicker';
import { Instructions } from './components/Instructions';
import { EvaluationType } from './components/EvaluationType';
import { OtherOptions } from './components/OtherOptions';
import { Buttons } from './components/Buttons';

export function useFormLocalizations() {
  const key = prefixPN('assignmentForm');
  const [, translations] = useTranslateLoader(key);

  const labels = React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return get(res, key);
    }

    return {};
  }, [translations]);

  return labels;
}

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
  action,
  assignable,
  buttonsComponent,
  evaluationType,
  evaluationTypes,
  hideMaxTime,
  hideSectionHeaders,
  onlyOneSubject,
  onSubmit,
  showEvaluation,
  showInstructions,
  showMessageForStudents,
  showReport,
  showResponses,
  withoutLayout,

  defaultValues,
}) {
  const localizations = useFormLocalizations();
  const form = useForm({
    defaultValues,
  });
  const { control, handleSubmit } = form;

  const submitHandler = React.useCallback(
    (...props) => onSubmitFunc(onSubmit, evaluationType, ...props),
    [onSubmit, evaluationType]
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <FormProvider {...form}>
        <Layout
          assignable={assignable}
          action={action}
          buttonsComponent={buttonsComponent ?? <Buttons localizations={localizations?.buttons} />}
          onlyContent={!!withoutLayout}
        >
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
              />
            )}
          />
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
        </Layout>
      </FormProvider>
    </form>
  );
}

Form.propTypes = {
  action: PropTypes.string,
  assignable: PropTypes.object,
  buttonsComponent: PropTypes.node,
  defaultValues: PropTypes.object,
  evaluationType: PropTypes.oneOf(['manual', 'auto', 'none']).isRequired,
  evaluationTypes: PropTypes.arrayOf('string'),
  hideMaxTime: PropTypes.bool,
  hideSectionHeaders: PropTypes.bool,
  onlyOneSubject: PropTypes.bool,
  onSubmit: PropTypes.func,
  showEvaluation: PropTypes.bool,
  showInstructions: PropTypes.bool,
  showMessageForStudents: PropTypes.bool,
  showReport: PropTypes.bool,
  showResponses: PropTypes.bool,
  withoutLayout: PropTypes.bool,
};
