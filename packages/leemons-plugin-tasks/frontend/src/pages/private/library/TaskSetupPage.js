import React, { useMemo, useEffect, useState } from 'react';
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
  DesignData,
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
  const [status, setStatus] = useState('published');
  const [store, render] = useStore({
    currentTask: null,
    headerHeight: null,
  });

  const { useObserver: useSaveObserver, emitEvent, subscribe, unsubscribe } = useObserver();

  const history = useHistory();

  // ·········································································
  // API CALLS

  const saveTask = async (values, redirectTo = 'library') => {
    try {
      const body = {
        ...values,
        subjects: values.subjects.map((subject) => ({
          ...subject,
          curriculum: {
            objectives: values?.curriculum[subject.subject]?.objectives?.map(
              ({ objective }) => objective
            ),
            contents: values?.curriculum[subject.subject]?.contents?.map(({ content }) => content),
            assessmentCriteria: values?.curriculum[subject.subject]?.assessmentCriteria?.map(
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
      setStatus('published');

      addSuccessAlert(t('common.publish'));
    } catch (e) {
      addErrorAlert(e.error);
      throw e;
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
        task.curriculum[subject.subject] = subject.curriculum;
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

      setStatus(store?.currentTask?.status);

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
    store.headerHeight = size?.height;
    render();
  };

  // ·········································································
  // INIT VALUES

  const headerLabels = useMemo(
    () => ({
      title: isEmpty(store.currentTask) ? t('title') : t('edit_title'),
    }),
    [t, store.currentTask]
  );

  const setupProps = useMemo(() => {
    if (!isNil(labels)) {
      const { basicData, configData, designData, contentData, instructionData } = labels;

      return {
        editable: isEmpty(store.currentTask),
        values: store.currentTask || {},
        steps: [
          {
            label: basicData.step_label,
            content: <BasicData useObserver={useSaveObserver} {...basicData} />,
          },
          {
            label: configData.step_label,
            content: <ConfigData useObserver={useSaveObserver} {...configData} />,
          },
          {
            label: designData.step_label,
            content: <DesignData useObserver={useSaveObserver} {...designData} />,
          },
          {
            label: contentData.step_label,
            content: <ContentData useObserver={useSaveObserver} {...contentData} />,
          },
          {
            label: instructionData.step_label,
            content: <InstructionData useObserver={useSaveObserver} {...instructionData} />,
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
        buttons={{ duplicate: t('common.save'), edit: status === 'draft' && t('common.publish') }}
        onDuplicate={() => emitEvent('saveTask')}
        onEdit={() => handleOnPublishTask().catch(() => {})}
        onResize={handleOnHeaderResize}
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
