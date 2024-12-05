import { useEffect, useCallback } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import {
  EvaluationType,
  evaluationTypes,
} from '@assignables/components/Assignment/components/EvaluationType';
import {
  Box,
  ContextContainer,
  Button,
  TotalLayoutFooterContainer,
  createStyles,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import AssignConfig from '@tests/components/AssignConfig';
import { RulesConfig } from '@tests/components/RulesConfig';
import prefixPN from '@tests/helpers/prefixPN';
import {
  createAssignedConfigRequest,
  deleteAssignedConfigRequest,
  getAssignConfigsRequest,
  getTestRequest,
  updateAssignedConfigRequest,
} from '@tests/request';

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

  async function handleCreateAssignmentConfig(values) {
    try {
      const id = await createAssignedConfigRequest(values.presetName, values);

      addSuccessAlert(t('createdConfigSuccess'));
      return id;
    } catch (e) {
      addErrorAlert(e.message);
    }
  }

  async function handleDeleteAssignmentConfig(id) {
    try {
      await deleteAssignedConfigRequest(id);
      addSuccessAlert(t('deletedConfig'));
    } catch (e) {
      addErrorAlert(e.message);
    }
    const { configs } = await getAssignConfigsRequest();
    store.configs = configs;
    render();

    // store.configs = store.configs.filter((c) => c.id !== id);
    // render();
  }

  async function handleUpdateAssignmentConfig(id, name, config) {
    try {
      await updateAssignedConfigRequest(id, name, config);
      addSuccessAlert(t('updatedConfig'));
    } catch (e) {
      addErrorAlert(e.message);
    }
    const { configs } = await getAssignConfigsRequest();
    store.configs = configs;
    render();
  }

  const onSubmit = useCallback(
    form.handleSubmit(async (values) => {
      if (values.rules?.filters?.settings === 'new' && values.rules?.filters?.presetName) {
        const id = await handleCreateAssignmentConfig(values.rules.filters);
        values.rules.filters.configSelected = id;
        values.rules.filters.settings = 'existing';
      }

      onSave({
        config: {
          ...values?.evaluation?.evaluation,
          curriculum: Object.fromEntries(
            (values.evaluation.curriculum || []).map((category) => [category, true])
          ),
          showCorrectAnswers: !values.others?.hideResponses,
          metadata: { ...values?.assignConfig, ...values?.rules, evaluationType: 'auto' },
        },
        raw: values,
      });
    })
  );

  if (!store?.test?.id) {
    return <LoadingOverlay visible />;
  }
  return (
    <Box>
      <FormProvider {...form}>
        <Box>
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
            <Controller
              control={form.control}
              name="rules"
              render={({ field }) => (
                <RulesConfig
                  {...field}
                  isDrawer
                  hideButtons
                  stepName={t('rules')}
                  defaultValues={field.value?.filters}
                  onDeleteConfig={handleDeleteAssignmentConfig}
                  onUpdateConfig={handleUpdateAssignmentConfig}
                  onChangeRules={field.onChange}
                  test={store.test}
                  assignable={store.assignable}
                  data={store.rawData}
                  configs={store.configs}
                  loading={store.loading}
                  t={t}
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
      evaluationType: 'auto',
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
