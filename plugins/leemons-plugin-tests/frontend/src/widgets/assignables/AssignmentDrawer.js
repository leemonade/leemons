import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  EvaluationType,
  evaluationTypes,
} from '@assignables/components/Assignment/components/EvaluationType';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import {
  Box,
  ContextContainer,
  Button,
  TotalLayoutFooterContainer,
  createStyles,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { map } from 'lodash';
import AssignConfig from '@tests/components/AssignConfig';
import { useStore } from '@common';
import { getAssignConfigsRequest, getTestRequest } from '@tests/request';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';

export const useAssignmentDrawerStyles = createStyles(() => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
}));

async function init({ assignable, store, render }) {
  try {
    const [{ test }, { configs }] = await Promise.all([
      getTestRequest(assignable.id, { withQuestionBank: true }),
      getAssignConfigsRequest(),
    ]);
    store.configs = configs;
    store.test = test;
    store.assignable = {
      subjects: map(test.subjects, (id, i) => ({
        subject: id,
        program: test.program,
        // EN: As long as curriculum is not subject-specific, we provide it in the first subject, so less calculations are needed.
        // ES: Mientras que el curriculum no sea específico por asignatura, se proporciona en la primera asignatura, por lo que se hace menos cálculos.
        curriculum: i === 0 ? test.curriculum : undefined,
      })),
    };
    render();
  } catch (error) {
    addErrorAlert(error);
  }
}

export default function AssignmentDrawer({ assignable, value, onSave, onClose, scrollRef }) {
  const form = useForm({ defaultValues: value });
  const localizations = useFormLocalizations();
  const [store, render] = useStore();
  const [t] = useTranslateLoader(prefixPN('testAssign'));

  useEffect(() => {
    if (store.test?.id !== assignable.id) {
      init({ assignable, store, render });
    }
  }, [assignable?.id]);

  const onSubmit = useCallback(
    form.handleSubmit((values) =>
      onSave({
        config: {
          ...values?.evaluation?.evaluation,
          curriculum: Object.fromEntries(
            (values.evaluation.curriculum || []).map((category) => [category, true])
          ),
          showCorrectAnswers: !values.others?.hideResponses,
          metadata: values?.assignConfig,
        },
        raw: values,
      })
    )
  );

  if (!store?.test?.id) {
    return <LoadingOverlay visible />;
  }

  return (
    <Box>
      <FormProvider {...form}>
        <Box style={{ paddingBottom: 80 }}>
          <ContextContainer padded>
            <Controller
              control={form.control}
              name="evaluation"
              render={({ field }) => (
                <EvaluationType
                  {...field}
                  assignable={assignable}
                  evaluationTypes={['calificable', 'punctuable']}
                  localizations={localizations?.evaluation}
                  onDrawer
                />
              )}
            />
            <Controller
              control={form.control}
              name="assignConfig"
              render={({ field }) => (
                <AssignConfig
                  {...field}
                  test={store.test}
                  configs={store.configs}
                  defaultValues={field.value}
                  t={t}
                  hideButtons
                  isDrawer={true}
                />
              )}
            />
          </ContextContainer>
        </Box>
        <TotalLayoutFooterContainer
          fixed
          style={{ right: 0 }}
          scrollRef={scrollRef}
          width={728}
          rightZone={<Button onClick={onSubmit}>{localizations?.buttons?.save}</Button>}
          leftZone={
            <Button variant="link" onClick={onClose}>
              {localizations?.buttons?.cancel}
            </Button>
          }
        />
      </FormProvider>
    </Box>
  );
}

AssignmentDrawer.defaultValues = async (activity) => {
  const { test } = await getTestRequest(activity.id);

  return {
    showCorrectAnswers: true,
    metadata: {
      filters: {
        useAllQuestions: true,
      },
      questions: map(test.questions, 'id'),
    },
    ...evaluationTypes.calificable,
  };
};

AssignmentDrawer.propTypes = {
  assignable: PropTypes.object,
  onSave: PropTypes.func,
  value: PropTypes.object,
  scrollRef: PropTypes.object,
  onClose: PropTypes.func,
};
