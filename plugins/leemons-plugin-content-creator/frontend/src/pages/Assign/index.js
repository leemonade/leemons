import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Stack } from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import Form from '@assignables/components/Assignment/Form';
import prefixPN from '@content-creator/helpers/prefixPN';
import { assignDocumentRequest, getDocumentRequest } from '@content-creator/request';

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('contentCreatorAssign'));

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
      await assignDocumentRequest(params.id, taskInstanceData);

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
      const { document } = await getDocumentRequest(params.id);
      store.document = document;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id && !store.document) init();
  }, [params]);

  return (
    <Form
      action={t('assign')}
      onSubmit={send}
      showInstructions
      showMessageForStudents
      assignable={store.document}
      evaluationType="none"
      evaluationTypes={['nonEvaluable']}
      buttonsComponent={
        <Stack fullWidth justifyContent="end">
          <Button loading={store.loading} type="submit">
            {t('assignNow')}
          </Button>
        </Stack>
      }
    />
  );
}
