import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import Form from '@assignables/components/Assignment/Form';
import prefixPN from '@content-creator/helpers/prefixPN';
import { assignDocumentRequest } from '@content-creator/request';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';

export default function Assign() {
  const history = useHistory();
  const params = useParams();

  const [t] = useTranslateLoader(prefixPN('contentCreatorAssign'));

  const { data: assignable, isLoading } = useAssignables({ id: params.id });

  const [store, render] = useStore({
    loading: false,
    isNew: false,
    data: {
      metadata: {},
    },
  });

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

  return (
    <Form
      loading={store.loading ?? isLoading}
      onSubmit={send}
      showInstructions
      showMessageForStudents
      assignable={assignable}
      evaluationType="none"
      evaluationTypes={['nonEvaluable']}
    />
  );
}
