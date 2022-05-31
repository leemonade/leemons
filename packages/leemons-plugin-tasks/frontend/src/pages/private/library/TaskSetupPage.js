import React, { useMemo, useEffect, useState, useRef } from 'react';
import { isEmpty, isNil, isArray } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Stack } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useStore, unflatten } from '@common';
import {
  Setup,
  BasicData,
  ConfigData,
  ContentData,
  InstructionData,
} from '../../../components/TaskSetupPage';
import { prefixPN } from '../../../helpers';
import saveTaskRequest from '../../../request/task/saveTask';
import publishTaskRequest from '../../../request/task/publishTask';
import getTaskRequest from '../../../request/task/getTask';
import useObserver from '../../../helpers/useObserver';

export default function TaskSetupPage() {
  const [t, translations] = useTranslateLoader(prefixPN('task_setup_page'));
  const [labels, setLabels] = useState(null);
  const loading = useRef(null);
  const [store, render] = useStore({
    currentTask: null,
    taskName: null,
    headerHeight: null,
  });

  const { useObserver: useSaveObserver, emitEvent, subscribe, unsubscribe } = useObserver();

  const history = useHistory();

  // ·········································································
  // API CALLS

  const saveTask = async ({ program, curriculum, ...values }, redirectTo = 'library') => {
    try {
      const body = {
        gradable: false,
        ...values,
        // TODO: Esto debe establecerse en el Config
        subjects: values?.subjects?.map((subject) => ({
          program,
          ...subject,
          curriculum: curriculum && {
            objectives: curriculum[subject.subject]?.objectives?.map(({ objective }) => objective),
            contents: curriculum[subject.subject]?.contents?.map(({ content }) => content),
            assessmentCriteria: curriculum[subject.subject]?.assessmentCriteria?.map(
              ({ assessmentCriteria }) => assessmentCriteria
            ),
          },
        })),
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

      history.push(
        redirectTo === 'library'
          ? '/private/tasks/library'
          : `/private/tasks/library/edit/${fullId}`
      );

      emitEvent('taskSaved');
    } catch (e) {
      addErrorAlert(e.message);
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
      if (loading.current === 'edit') {
        loading.current = null;
        render();
      }
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
          contents: curriculum?.contents?.map((content) => ({ content })),
          assessmentCriteria: curriculum?.assessmentCriteria?.map((assessmentCriteria) => ({
            assessmentCriteria,
          })),
        };
      });
      return task;
    } catch (e) {
      addErrorAlert(e.message);
      return {};
    }
  };

  // ·········································································
  // LOAD INIT DATA

  const { id } = useParams();

  useEffect(async () => {
    if (!isEmpty(id)) {
      store.currentTask = await getTask(id);
      render();
    }
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
        }
      };

      subscribe(f);
    });

  useEffect(() => {
    const f = async (event) => {
      try {
        if (event === 'publishTaskAndLibrary') {
          await handleOnPublishTask();
          history.push(`/private/tasks/library`);
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

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  const handleOnNameChange = (name) => {
    store.taskName = name;
    render();
  };

  // ·········································································
  // INIT VALUES

  const headerLabels = useMemo(
    () => ({
      title: isNil(store.taskName) || isEmpty(store.taskName) ? t('title') : store.taskName,
    }),
    [t, store.taskName]
  );

  const setupProps = useMemo(() => {
    if (!isNil(labels)) {
      const { basicData, configData, contentData, instructionData } = labels;
      const steps = ['basicData', 'configData', 'contentData', 'instructionData'];
      const completedSteps =
        store.currentTask?.metadata?.visitedSteps?.map((step) => steps.indexOf(step)) || [];

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
                useObserver={useSaveObserver}
                onNameChange={handleOnNameChange}
              />
            ),
            status: 'OK',
          },
          {
            label: configData.step_label,
            content: <ConfigData useObserver={useSaveObserver} {...configData} />,
            status: 'OK',
          },
          {
            label: contentData.step_label,
            content: <ContentData useObserver={useSaveObserver} {...contentData} />,
            status: 'OK',
          },
          {
            label: instructionData.step_label,
            content: <InstructionData useObserver={useSaveObserver} {...instructionData} />,
            status: 'OK',
          },
        ],
      };
    }
    return null;
  }, [store.currentTask, labels]);

  // -------------------------------------------------------------------------
  // COMPONENT

  return (
    <Stack direction="column" fullHeight>
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
