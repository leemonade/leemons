import Form from "@assignables/components/Assignment/Form";
import useAssignables from "@assignables/requests/hooks/queries/useAssignables";
import { useStore } from "@common";
import prefixPN from "@content-creator/helpers/prefixPN";
import { assignDocumentRequest } from "@content-creator/request";
import { addErrorAlert, addSuccessAlert } from "@layout/alert";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import { useNavigate, useParams } from "react-router-dom";

export default function Assign() {
  const navigate = useNavigate();
  const params = useParams();

  const [t] = useTranslateLoader(prefixPN("contentCreatorAssign"));

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

      addSuccessAlert(t("assignDone"));
      navigate("/private/assignables/ongoing");
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
      evaluationTypes={["nonEvaluable"]}
    />
  );
}
