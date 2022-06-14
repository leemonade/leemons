import React from 'react';
import { forIn, map, omit, set, uniq } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  ContextContainer,
  Stack,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import Form from '@assignables/components/Assignment/Form';
import { assignTestRequest, getTestRequest } from '../../../request';
import AssignConfig from '../../../components/AssignConfig';

function parseDates(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return undefined;
}

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('testAssign'));

  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
    data: {
      metadata: {},
    },
  });

  const history = useHistory();
  const params = useParams();

  async function send() {
    const { assignees, teachers, dates, curriculum, alwaysAvailable, ...instanceData } = store.data;

    const students = uniq(assignees.flatMap((assignee) => assignee.students));
    const classes = assignees.flatMap((assignee) => assignee.group);

    forIn(dates, (value, key) => {
      dates[key] = parseDates(value);
    });

    try {
      const taskInstanceData = {
        gradable: true,
        ...instanceData,
        students,
        classes,
        curriculum: curriculum ? omit(curriculum, 'toogle') : {},
        alwaysAvailable: alwaysAvailable || false,
        dates: alwaysAvailable ? {} : dates,
      };

      if (assignees[0]?.type === 'custom') {
        set(taskInstanceData, 'metadata.groupName', assignees[0].name);
      }

      await assignTestRequest(store.test.id, taskInstanceData);

      addSuccessAlert(t('assignDone'));
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    }
  }

  async function init() {
    try {
      const { test } = await getTestRequest(params.id, { withQuestionBank: true });
      store.test = test;
      store.assignable = {
        subjects: map(test.subjects, (id) => ({
          subject: id,
        })),
      };
      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  function handleAssignment(e) {
    store.data = { ...store.data, ...e };
    store.currentStep = 1;
    render();
  }

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  React.useEffect(() => {
    if (params?.id && (!store.test || store.test.id !== params.id)) init();
  }, [params]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{ title: `${t('pageTitle')} ${store.test?.name || ''}` }}
        onResize={handleOnHeaderResize}
      />
      <Box>
        {store.assignable ? (
          <VerticalStepperContainer
            stickyAt={store.headerHeight}
            currentStep={store.currentStep}
            data={[
              { label: t('assign'), status: 'OK' },
              { label: t('config'), status: 'OK' },
            ]}
          >
            {store.currentStep === 0 && (
              <Form
                defaultValues={store.data}
                onSubmit={handleAssignment}
                assignable={store.assignable}
                sendButton={
                  <Stack fullWidth justifyContent="end">
                    <Button type="submit">{t('next')}</Button>
                  </Stack>
                }
              />
            )}
            {store.currentStep === 1 && (
              <AssignConfig
                defaultValues={store.data.metadata}
                test={store.test}
                t={t}
                onBack={(e) => {
                  store.data.metadata = { ...store.data.metadata, ...e };
                  store.currentStep = 0;
                  render();
                }}
                onSend={(e) => {
                  store.data.metadata = { ...store.data.metadata, ...e };
                  send();
                }}
              />
            )}
          </VerticalStepperContainer>
        ) : null}
      </Box>
    </ContextContainer>
  );
}
