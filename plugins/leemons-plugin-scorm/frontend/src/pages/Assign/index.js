import Form from "@assignables/components/Assignment/Form";
import { Loader } from "@bubbles-ui/components";
import { useStore } from "@common";
import { addErrorAlert, addSuccessAlert } from "@layout/alert";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import { prefixPN } from "@scorm/helpers";
import { assignPackageRequest, getPackageRequest } from "@scorm/request";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN("scormAssign"));

  const [store, render] = useStore({
    loading: false,
    isNew: false,
    package: null,
    currentStep: 0,
    data: {
      metadata: {},
    },
  });

  const navigate = useNavigate();
  const params = useParams();

  async function send({ value: taskInstanceData }) {
    store.loading = true;
    render();

    try {
      await assignPackageRequest(params.id, taskInstanceData);

      addSuccessAlert(t("assignDone"));
      navigate("/private/assignables/ongoing");
    } catch (e) {
      addErrorAlert(e.message);
    }
    store.loading = false;
    render();
  }

  async function init() {
    try {
      const { scorm } = await getPackageRequest(params.id);
      store.package = scorm;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id && !store.package) {
      init();
    }
  }, [params]);

  const isGradable = !!store.package?.gradable;

  if (!store.package) {
    return <Loader />;
  }

  return (
    <Form
      assignable={store.package}
      evaluationType={isGradable ? "auto" : "none"}
      evaluationTypes={isGradable ? ["calificable", "punctuable"] : ["nonEvaluable"]}
      hideMaxTime
      onSubmit={send}
      showEvaluation={isGradable}
      showMessageForStudents
      loading={store.loading}
    />
  );
}
