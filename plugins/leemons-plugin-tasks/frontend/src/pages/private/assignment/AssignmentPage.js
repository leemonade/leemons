import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { useParams, useHistory } from 'react-router-dom';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import Form from '@assignables/components/Assignment/Form';
import createInstanceRequest from '../../../request/instance/createInstance';
import getTaskRequest from '../../../request/task/getTask';
import { prefixPN } from '../../../helpers/prefixPN';

function useAssignmentPageLocalizations() {
  const key = prefixPN('assignment_page');
  const [, translations] = useTranslateLoader(key);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return get(res, key);
    }

    return {};
  }, [translations]);
}

export default function AssignmentPage() {
  const history = useHistory();
  const labels = useAssignmentPageLocalizations();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setLoading: setPageLoading } = useLayout();

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setPageLoading(true);
      if (!id) {
        return;
      }
      const t = await getTaskRequest({ id });

      setPageLoading(false);
      setTask(t);
    })();
  }, [id]);

  const handleAssignment = async ({ value }) => {
    try {
      setLoading(true);
      await createInstanceRequest(id, value);

      addSuccessAlert('Assignment created successfully');
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <Form
      action={labels?.action}
      onSubmit={handleAssignment}
      assignable={task}
      evaluationType="manual"
      evaluationTypes={!task?.submission ? ['nonEvaluable'] : undefined}
      showEvaluation={!!task?.submission}
      showMessageForStudents
      loading={loading}
    />
  );
}
