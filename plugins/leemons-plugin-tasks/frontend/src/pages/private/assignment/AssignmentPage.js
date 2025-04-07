import Form from "@assignables/components/Assignment/Form";
import { unflatten } from "@common";
import { addErrorAlert, addSuccessAlert } from "@layout/alert";
import { useLayout } from "@layout/context";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import { get } from "lodash";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { prefixPN } from "../../../helpers/prefixPN";
import createInstanceRequest from "../../../request/instance/createInstance";
import getTaskRequest from "../../../request/task/getTask";

function useAssignmentPageLocalizations() {
  const key = prefixPN("assignment_page");
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
  const navigate = useNavigate();
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

      addSuccessAlert("Assignment created successfully");
      navigate("/private/assignables/ongoing");
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
      evaluationTypes={!task?.submission ? ["nonEvaluable"] : undefined}
      showEvaluation={!!task?.submission}
      showMessageForStudents
      loading={loading}
    />
  );
}
