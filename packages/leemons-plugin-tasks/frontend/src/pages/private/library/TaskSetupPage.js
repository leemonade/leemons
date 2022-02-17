import React, { useMemo, useEffect, useState } from 'react';
import { isEmpty, isNil, isArray } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import { Paper, PageContainer, ContextContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useStore, useRequestErrorMessage, unflatten } from '@common';
import {
  Setup,
  ConfigData,
  DesignData,
  ContentData,
  InstructionData,
  PublishData,
} from '../../../components/TaskSetupPage';
import { prefixPN } from '../../../helpers';
import saveTaskRequest from '../../../request/task/saveTask';
import publishTaskRequest from '../../../request/task/publishTask';
import getTaskRequest from '../../../request/task/getTask';

export default function TaskSetupPage() {
  const [t, translations] = useTranslateLoader(prefixPN('task_setup_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [labels, setLabels] = useState(null);
  const [store, render] = useStore({
    currentTask: null,
  });

  const history = useHistory();

  //! Use an observer / event emitter to emit the children when to notify current data and use them to save or publish

  // ·········································································
  // API CALLS

  const saveTask = async (values) => {
    try {
      const body = { ...values };
      let messageKey = 'create_done';

      if (!isEmpty(store.currentTask)) {
        messageKey = 'update_done';
      }
      await saveTaskRequest(store?.currentTask?.fullId, body);

      // TODO: Implement save task request call
      // const response = await apiCall(values);
      // store.currentTask = response.task;

      addSuccessAlert(t(messageKey));
      history.push('/private/tasks/library');
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const publishTask = async (id) => {
    try {
      if (isEmpty(id)) {
        addErrorAlert('No task id provided');
        return;
      }

      await publishTaskRequest(id);

      addSuccessAlert(t('publish_done'));
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const getTask = async (id) => {
    try {
      return await getTaskRequest(id);
      // TODO: Implement get task by id request
      // const response = await apiCall(id);
      // store.currentTask = response.task;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
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
      // store.setupLabels = data;
    }
  }, [translations]);

  // ·········································································
  // HANDLERS

  const handleOnSaveTask = (values) => {
    saveTask(values);
  };

  const handleOnPublishTask = () => {
    publishTask(id);
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
      const { configData, designData, contentData, instructionData, publishData } = labels;

      return {
        editable: isEmpty(store.currentTask),
        values: store.currentTask || {},
        steps: [
          {
            label: configData.step_label,
            content: <ConfigData {...configData} />,
          },
          {
            label: designData.step_label,
            content: <DesignData {...designData} />,
          },
          {
            label: contentData.step_label,
            content: <ContentData {...contentData} />,
          },
          {
            label: instructionData.step_label,
            content: <InstructionData {...instructionData} />,
          },
          {
            label: publishData.step_label,
            content: <PublishData {...publishData} />,
          },
        ],
      };
    }
    return null;
  }, [store.currentTask, labels]);

  // -------------------------------------------------------------------------
  // COMPONENT

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={headerLabels}
        buttons={{ edit: 'Save draft', duplicate: id && 'Publish' }}
        onEdit={handleOnSaveTask}
        onDuplicate={handleOnPublishTask}
      />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Paper fullWidth padding={5}>
              {!isEmpty(setupProps) && isArray(setupProps.steps) && (
                <Setup {...setupProps} onSave={handleOnSaveTask} />
              )}
            </Paper>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
