import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isArray, isEmpty, isNil } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Stack } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { unflatten, useProcessTextEditor, useQuery, useSearchParams, useStore } from '@common';
import { ObservableContextProvider, useObservableContext } from '@common/context/ObservableContext';
import { getAssetsByIdsRequest } from '@leebrary/request';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { BasicData, ContentData, InstructionData, Setup } from '../../../components/TaskSetupPage';
import { prefixPN } from '../../../helpers';
import saveTaskRequest from '../../../request/task/saveTask';
import publishTaskRequest from '../../../request/task/publishTask';
import getTaskRequest from '../../../request/task/getTask';
import useObserver from '../../../helpers/useObserver';

async function processDevelopment({ values, store, processTextEditor }) {
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
  }
}

function useHeaderLabels(t) {
  const { useWatch } = useObservableContext();
  const taskName = useWatch({ name: 'taskName' });

  const headerLabels = useMemo(
    () => ({
      title: isNil(taskName) || isEmpty(taskName) ? t('title') : taskName,
    }),
    [t, taskName]
  );

  return headerLabels;
}

function TaskSetupHeader({ t, emitEvent, loading, store, render }) {
  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  const headerLabels = useHeaderLabels(t);

  return (
    <AdminPageHeader
      variant="teacher"
      icon={<PluginAssignmentsIcon />}
      values={headerLabels}
      buttons={{
        duplicate: t('common.save'),
        edit: t('common.publish'),
      }}
      onDuplicate={() => {
        loading.current = 'duplicate';
        render();
        emitEvent('saveTask');
      }}
      onEdit={() => {
        loading.current = 'edit';
        render();
        emitEvent('publishTaskAndLibrary');
      }}
      onResize={handleOnHeaderResize}
      loading={loading.current}
    />
  );
}

function useSetupProps({ labels, store, useSaveObserver }) {
  const { useWatch } = useObservableContext();
  const isExpress = !!useWatch({ name: 'isExpress' });

  const steps = useMemo(() => ['basicData', 'contentData', 'instructionData'], []);
  const completedSteps = useMemo(
    () => store.currentTask?.metadata?.visitedSteps?.map((step) => steps.indexOf(step)) || [],
    []
  );

  const setupProps = useMemo(() => {
    if (isNil(labels)) {
      return null;
    }

    const { basicData, contentData, instructionData } = labels;

    if (contentData) {
      contentData.labels.buttonPublish = instructionData?.labels?.buttonPublish;
      contentData.labels.buttonPublishAndAssign = instructionData?.labels?.buttonNext;
    }

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
                subjects: { show: true, required: true, showLevel: true, maxOne: false },
              }}
              useObserver={useSaveObserver}
            />
          ),
          status: 'OK',
        },
        {
          label: contentData.step_label,
          content: <ContentData useObserver={useSaveObserver} {...contentData} />,
          status: 'OK',
        },
        !isExpress && {
          label: instructionData.step_label,
          content: <InstructionData useObserver={useSaveObserver} {...instructionData} />,
          status: 'OK',
        },
      ].filter(Boolean),
    };
  }, [store.currentTask, completedSteps, store.currentTask, labels, useSaveObserver, isExpress]);

  return setupProps;
}

function TaskSetup() {
  const searchParams = useSearchParams();
  const [t, translations] = useTranslateLoader(prefixPN('task_setup_page'));
  const [labels, setLabels] = useState(null);
  const loading = useRef(null);
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
        // TODO: Esto debe establecerse en el Config
        subjects: values?.subjects?.map((subject) => ({
          program,
          ...subject,
          curriculum: curriculum && {
            objectives: curriculum[subject.subject]?.objectives?.map(({ objective }) => objective),
            curriculum: curriculum[subject.subject]?.curriculum?.map(
              ({ curriculum }) => curriculum
            ),
          },
        })),
      };

      let messageKey = 'create_done';

      if (!isEmpty(store.currentTask)) {
        messageKey = 'update_done';
      }

      const isCreating = searchParams.has('fromNew') || !store?.currentTask?.id;

      const {
        task: { fullId },
      } = await saveTaskRequest(store?.currentTask?.id, body);

      if (!store.currentTask) {
        store.currentTask = {};
      }

      store.currentTask.id = fullId;

      addSuccessAlert(t(`common.${messageKey}`));

      history.push(
        redirectTo === 'library'
          ? '/private/leebrary/assignables.task/list?activeTab=draft'
          : `/private/tasks/library/edit/${fullId}${isCreating ? '?fromNew' : ''}`
      );

      emitEvent('taskSaved');
    } catch (e) {
      addErrorAlert(e.message);
      emitEvent('saveTaskFailed');
    } finally {
      if (loading.current === 'duplicate') {
        loading.current = null;
        render();
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
      loading.current = null;
      render();
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
          curriculum: curriculum?.curriculum?.map((curriculum) => ({ curriculum })),
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
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.task_setup_page.setup;
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
          if (loading.current === 'edit') {
            loading.current = null;
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
        } else if (event === 'saveTaskFailed') {
          if (loading.current) {
            loading.current = null;
            render();
          }
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

  const setupProps = useSetupProps({ labels, store, useSaveObserver });

  // -------------------------------------------------------------------------
  // COMPONENT

  return (
    <Stack direction="column" fullHeight>
      <TaskSetupHeader
        t={t}
        emitEvent={emitEvent}
        loading={loading}
        render={render}
        store={store}
      />
      <Box>
        {!isEmpty(setupProps) && isArray(setupProps.steps) && (
          <Setup
            {...setupProps}
            stickyAt={store.headerHeight}
            useObserver={useSaveObserver}
            onSave={handleOnSaveTask}
          />
        )}
      </Box>
    </Stack>
  );
}

const TaskSetupPage = React.forwardRef((props, ref) => (
  <ObservableContextProvider value={{ sharedData: {} }}>
    <TaskSetup {...props} ref={ref} />
  </ObservableContextProvider>
));

TaskSetupPage.displayName = 'TaskSetupPage';

export default TaskSetupPage;
