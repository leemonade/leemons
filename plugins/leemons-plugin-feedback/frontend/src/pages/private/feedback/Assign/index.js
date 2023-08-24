import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Stack } from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import Form from '@assignables/components/Assignment/Form';
import { assignFeedbackRequest, getFeedbackRequest } from '@feedback/request';

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

  async function send({ value: taskInstanceData }) {
    store.loading = true;
    render();

    try {
      await assignFeedbackRequest(params.id, taskInstanceData);

      addSuccessAlert(t('assignDone'));
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    }
    store.loading = false;
    render();
  }

  async function init() {
    try {
      const { feedback } = await getFeedbackRequest(params.id);
      store.feedback = feedback;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id && !store.feedback) init();
  }, [params]);

  return (
    <Form
      action={t('assign')}
      onSubmit={send}
      showReport
      showMessageForStudents
      assignable={store.feedback}
      evaluationType="none"
      evaluationTypes={['nonEvaluable']}
      buttonsComponent={
        <Stack fullWidth justifyContent="end">
          <Button loading={store.loading} type="submit">
            {t('assign')}
          </Button>
        </Stack>
      }
    />
  );
}
