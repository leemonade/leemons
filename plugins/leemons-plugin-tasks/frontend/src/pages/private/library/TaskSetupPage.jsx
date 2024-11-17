import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray, isEmpty, isNil, isString } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  TotalLayoutContainer,
  TotalLayoutHeader,
  AssetTaskIcon,
  Stack,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { unflatten, useProcessTextEditor, useQuery, useStore } from '@common';
import { ObservableContextProvider, useObservableContext } from '@common/context/ObservableContext';
import { getAssetsByIdsRequest } from '@leebrary/request';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import {
  BasicData,
  ContentData,
  InstructionData,
  EvaluationData,
  Setup,
} from '../../../components/TaskSetupPage';
import { prefixPN } from '../../../helpers';
import saveTaskRequest from '../../../request/task/saveTask';
import publishTaskRequest from '../../../request/task/publishTask';
import getTaskRequest from '../../../request/task/getTask';
import useObserver from '../../../helpers/useObserver';

async function processDevelopment({ values, store, processTextEditor }) {
  if (!values?.metadata?.hasDevelopment) {
    // eslint-disable-next-line no-param-reassign
    values.metadata.development = null;
    return;
  }

  const force = !!store.currentTask?.published;

  const developments = values?.metadata?.development;

  if (developments?.length || store.currentTask?.metadata?.development?.length) {
    const length = Math.max(
      developments?.length ?? 0,
      store.currentTask?.metadata?.development?.length ?? 0
    );
    const promises = [];

    for (let i = 0; i < length; i++) {
      const html = developments[i]?.development;
      const oldHtml = store.currentTask?.metadata?.development?.[i]?.development;

      promises.push(
        processTextEditor(html, oldHtml, { force }).then(
          (development) => development && { development }
        )
      );
    }

    // eslint-disable-next-line no-param-reassign
    values.metadata.development = (await Promise.all(promises)).filter(Boolean);
    return;
  }

  // eslint-disable-next-line no-param-reassign
  values.metadata.development = [];
}

function useHeaderLabels(t) {
  const { useWatch } = useObservableContext();
  const taskName = useWatch({ name: 'taskName' });

  return useMemo(
    () => ({
      title: isNil(taskName) || isEmpty(taskName) ? t('subTitle') : taskName,
    }),
    [t, taskName]
  );
}

function TaskSetupHeader({ t, store }) {
  const headerLabels = useHeaderLabels(t);
  const history = useHistory();
  return (
    <TotalLayoutHeader
      icon={
        <Stack justifyContent="center" alignItems="center">
          <AssetTaskIcon />
        </Stack>
      }
      title={t(!isEmpty(store?.currentTask) ? 'edit_title' : 'title')}
      formTitlePlaceholder={headerLabels.title}
      onCancel={() => history.goBack()}
      mainActionLabel={t('cancel')}
    />
  );
}

TaskSetupHeader.propTypes = {
  t: PropTypes.func,
  store: PropTypes.object,
};

function useSetupProps({ t, labels, store, useSaveObserver, scrollRef, loading, setLoading }) {
  const { useWatch } = useObservableContext();
  const isExpress = !!useWatch({ name: 'isExpress' });
  const sharedData = useWatch({ name: 'sharedData' });

  const defaultConfigValues = {
    hasInstructions: false,
    hasAttachments: false,
    hasCurriculum: false,
    hasCustomObjectives: false,
    hasDevelopment: false,
  };

  const config = useForm({ defaultValues: defaultConfigValues });
  const configValues = config.watch();

  useEffect(() => {
    if (sharedData?.metadata) {
      config.reset({
        hasInstructions: sharedData.metadata.hasInstructions,
        hasAttachments: sharedData.metadata.hasAttachments,
        hasCurriculum: sharedData.metadata.hasCurriculum,
        hasCustomObjectives: sharedData.metadata.hasCustomObjectives,
        hasDevelopment: sharedData.metadata.hasDevelopment,
      });
    }
  }, [sharedData]);

  const steps = useMemo(
    () => ['basicData', 'contentData', 'evaluationData', 'instructionData'],
    []
  );
  const completedSteps = useMemo(
    () => store.currentTask?.metadata?.visitedSteps?.map((step) => steps.indexOf(step)) || [],
    []
  );

  return useMemo(() => {
    if (isNil(labels)) {
      return null;
    }

    const {
      basicData,
      contentData,
      instructionData,
      resourcesData,
      resourcesAndInstructionsData,
      evaluationData,
    } = labels;
    const getStepLabelResourcesInstructions = () => {
      if (configValues.hasAttachments && configValues.hasInstructions) {
        return resourcesAndInstructionsData.step_label;
      }
      if (configValues.hasAttachments) {
        return resourcesData.step_label;
      }
      if (configValues.hasInstructions) {
        return instructionData.step_label;
      }
    };
    if (contentData) {
      contentData.labels.buttonPublish = instructionData?.labels?.buttonPublish;
      contentData.labels.buttonPublishAndAssign = instructionData?.labels?.buttonPublishAndAssign;
    }

    const showAttachmentsAndInstructions =
      !isExpress && (configValues.hasInstructions || configValues.hasAttachments);

    const showEvaluation =
      !isExpress && (configValues.hasCurriculum || configValues.hasCustomObjectives);

    return {
      editable: isEmpty(store.currentTask),
      values: store.currentTask || {},
      completedSteps,
      visitedSteps: completedSteps,
      steps: [
        {
          label: basicData.step_label,
          content: (
            <BasicData
              {...basicData}
              advancedConfig={{
                alwaysOpen: true,
                fileToRight: true,
                colorToRight: true,
                program: { show: true, required: false },
                subjects: { show: true, required: false, showLevel: true, maxOne: false },
              }}
              useObserver={useSaveObserver}
              stepName={basicData.step_label}
              scrollRef={scrollRef}
              loading={loading}
              setLoading={setLoading}
              t={t}
            />
          ),
          status: 'OK',
        },
        {
          label: contentData.step_label,
          content: (
            <ContentData
              useObserver={useSaveObserver}
              {...contentData}
              stepName={contentData.step_label}
              scrollRef={scrollRef}
              loading={loading}
              setLoading={setLoading}
              t={t}
              config={config}
            />
          ),
          status: 'OK',
        },

        showEvaluation && {
          label: evaluationData.step_label,
          content: (
            <EvaluationData
              useObserver={useSaveObserver}
              {...evaluationData}
              stepName={evaluationData.step_label}
              scrollRef={scrollRef}
              loading={loading}
              setLoading={setLoading}
              t={t}
              showCurriculum={configValues.hasCurriculum}
              showCustomObjectives={configValues.hasCustomObjectives}
              isLastStep={!configValues.hasAttachments && !configValues.hasInstructions}
            />
          ),
          status: 'OK',
        },

        showAttachmentsAndInstructions && {
          label: getStepLabelResourcesInstructions(),
          content: (
            <InstructionData
              useObserver={useSaveObserver}
              {...instructionData}
              stepName={instructionData.step_label}
              scrollRef={scrollRef}
              loading={loading}
              setLoading={setLoading}
              t={t}
              showAttachments={configValues.hasAttachments}
              showInstructions={configValues.hasInstructions}
            />
          ),
          status: 'OK',
        },
      ].filter(Boolean),
    };
  }, [
    store.currentTask,
    completedSteps,
    labels,
    useSaveObserver,
    isExpress,
    configValues,
    sharedData,
  ]);
}

function TaskSetup() {
  const [t, translations] = useTranslateLoader(prefixPN('task_setup_page'));
  const [labels, setLabels] = useState(null);
  const [loading, setLoading] = useState(null);
  const scrollRef = React.useRef();
  const [store, render] = useStore({
    currentTask: null,
    taskName: null,
    headerHeight: null,
  });

  const processTextEditor = useProcessTextEditor();

  const { useObserver: useSaveObserver, emitEvent, subscribe, unsubscribe } = useObserver();

  const history = useHistory();

  // ·········································································
  // API CALLS

  const saveTask = async ({ program, curriculum, ...values }, redirectTo = 'library') => {
    try {
      await processDevelopment({ values, store, processTextEditor });

      const body = {
        gradable: false,
        ...values,

        subjects: values?.subjects?.map((subject) =>
          isString(subject)
            ? {
                program,
                subject,
                curriculum: curriculum && {
                  objectives: curriculum[subject]?.objectives?.map(({ objective }) => objective),
                  curriculum: curriculum[subject]?.curriculum?.map((item) => item.curriculum),
                },
              }
            : subject
        ),
      };

      let messageKey = 'create_done';

      if (!isEmpty(store.currentTask)) {
        messageKey = 'update_done';
      }

      const {
        task: { fullId },
      } = await saveTaskRequest(store?.currentTask?.id, body);

      if (!store.currentTask) {
        store.currentTask = {};
      }

      store.currentTask.id = fullId;

      addSuccessAlert(t(`common.${messageKey}`));

      if (redirectTo === 'library') {
        history.push('/private/leebrary/assignables.task/list');
      } else {
        history.replace(`/private/tasks/library/edit/${fullId}`);
      }

      emitEvent('taskSaved');
    } catch (e) {
      addErrorAlert(e.message);
      emitEvent('saveTaskFailed');
    } finally {
      if (loading === 'draft') {
        setLoading(null);
      }
    }
  };

  const publishTask = async () => {
    try {
      const { id } = store.currentTask;

      if (isEmpty(id)) {
        addErrorAlert(t('common.no_id_error'));
        return;
      }

      await publishTaskRequest(id);
      store.currentTask.published = true;
      render();

      addSuccessAlert(t('common.publish_done'));
    } catch (e) {
      addErrorAlert(e.error);
      throw e;
    } finally {
      setLoading(null);
    }
  };

  const getTask = async (id) => {
    try {
      const task = await getTaskRequest({ id });
      if (!task) {
        return task;
      }

      task.curriculum = {};
      task?.subjects?.forEach((subject) => {
        const { curriculum } = subject;

        task.curriculum[subject.subject] = {
          objectives: curriculum?.objectives?.map((objective) => ({ objective })),
          curriculum: curriculum?.curriculum?.map((item) => ({ curriculum: item })),
        };
      });
      return task;
    } catch (e) {
      addErrorAlert(e.message);
      return {};
    }
  };

  const getAsset = async (id) => {
    const response = await getAssetsByIdsRequest([id]);

    const asset = response.assets[0];

    if (!asset) {
      return null;
    }

    return prepareAsset(asset);
  };

  // ·········································································
  // LOAD INIT DATA

  const { id } = useParams();
  const { asset } = useQuery();

  useEffect(() => {
    (async () => {
      if (!isEmpty(id)) {
        store.currentTask = await getTask(id);

        render();
      } else if (!isEmpty(asset)) {
        const assetData = await getAsset(asset);

        store.currentTask = {
          asset: {
            name: assetData.name,
            color: assetData.color,
            cover: assetData.cover,
          },
          resources: [asset],
        };
        render();
      }
    })();
  }, [id]);

  useEffect(() => {
    if (translations?.items) {
      const res = unflatten(translations.items);
      const data = res.tasks.task_setup_page.setup;
      setLabels(data);
    }
  }, [translations]);

  // ·········································································
  // HANDLERS

  const handleOnSaveTask = (values, redirectTo) => {
    saveTask(values, redirectTo);
  };

  const handleOnPublishTask = () =>
    new Promise((resolve, reject) => {
      emitEvent('saveTask');

      const f = async (event) => {
        if (event === 'taskSaved') {
          try {
            unsubscribe(f);
            resolve(await publishTask());
          } catch (e) {
            emitEvent('publishTaskFailed');
            reject(e);
          }
        } else if (event === 'saveTaskFailed') {
          unsubscribe(f);
          if (loading === 'publish') {
            setLoading(null);
            render();
          }
        }
      };

      subscribe(f);
    });

  useEffect(() => {
    const f = async (event) => {
      try {
        if (event === 'publishTaskAndLibrary') {
          await handleOnPublishTask();
          history.push(`/private/leebrary/assignables.task/list?activeTab=published`);
        } else if (event === 'publishTaskAndAssign') {
          await handleOnPublishTask();
          history.push(`/private/tasks/library/assign/${store.currentTask.id}`);
        } else if (event === 'saveTaskFailed' && !!loading) {
          setLoading(null);
        }
      } catch (e) {
        // EN: The error was previously handled
        // ES: El error ya fue manejado previamente
      }
    };

    subscribe(f);

    return () => unsubscribe(f);
  }, [handleOnPublishTask]);

  // ·········································································
  // INIT VALUES

  const setupProps = useSetupProps({
    t,
    labels,
    store,
    useSaveObserver,
    scrollRef,
    loading,
    setLoading,
  });

  // -------------------------------------------------------------------------
  // COMPONENT

  return (
    <TotalLayoutContainer scrollRef={scrollRef} Header={<TaskSetupHeader t={t} store={store} />}>
      {!isEmpty(setupProps) && isArray(setupProps.steps) && (
        <Setup
          {...setupProps}
          useObserver={useSaveObserver}
          onSave={handleOnSaveTask}
          scrollRef={scrollRef}
        />
      )}
    </TotalLayoutContainer>
  );
}

const TaskSetupPage = React.forwardRef((props, ref) => (
  <ObservableContextProvider value={{ sharedData: {} }}>
    <TaskSetup {...props} ref={ref} />
  </ObservableContextProvider>
));

TaskSetupPage.displayName = 'TaskSetupPage';

export default TaskSetupPage;
