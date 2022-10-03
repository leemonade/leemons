import React from 'react';
import { forIn, omit, set, uniq } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
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
import { assignFeedbackRequest } from '@feedback/request';

function parseDates(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return undefined;
}

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('feedbackAssign'));

  const [store, render] = useStore({
    loading: false,
    isNew: false,
    currentStep: 0,
    data: {
      metadata: {},
    },
  });

  const history = useHistory();
  const params = useParams();

  async function send(data) {
    store.loading = true;
    render();
    const { assignees, teachers, dates, curriculum, alwaysAvailable, ...instanceData } = data;

    const students = uniq(assignees.flatMap((assignee) => assignee.students));
    const classes = assignees.flatMap((assignee) => assignee.group);

    forIn(dates, (value, key) => {
      dates[key] = parseDates(value);
    });

    try {
      const taskInstanceData = {
        gradable: false,
        ...instanceData,
        students,
        classes,
        curriculum: curriculum ? omit(curriculum, 'toogle') : {},
        alwaysAvailable: alwaysAvailable || false,
        dates: alwaysAvailable ? {} : dates,
        showResults: data.assignStudents.assignmentSetup.showResults,
        showCorrectAnswers: false,
      };

      if (assignees[0]?.type === 'custom') {
        set(taskInstanceData, 'metadata.groupName', assignees[0].name);
        set(taskInstanceData, 'metadata.showGroupNameToStudents', assignees[0].showToStudents);
      }

      await assignFeedbackRequest(params.id, taskInstanceData);

      addSuccessAlert(t('assignDone'));
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    }
    store.loading = false;
    render();
  }

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{ title: `${t('pageTitle')} ${store.test?.name || ''}` }}
        onResize={handleOnHeaderResize}
      />
      <Box>
        <VerticalStepperContainer
          stickyAt={store.headerHeight}
          currentStep={store.currentStep}
          data={[{ label: t('assign'), status: 'OK' }]}
        >
          {store.currentStep === 0 && (
            <Form
              onSubmit={send}
              showResultsCheck
              hideDuration
              assignable={{}}
              variations={[]}
              sendButton={
                <Stack fullWidth justifyContent="end">
                  <Button loading={store.loading} type="submit">
                    {t('assign')}
                  </Button>
                </Stack>
              }
            />
          )}
        </VerticalStepperContainer>
      </Box>
    </ContextContainer>
  );
}
