import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Stack, Loader } from '@bubbles-ui/components';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import Form from '@assignables/components/Assignment/Form';
import { prefixPN } from '@scorm/helpers';
import { assignPackageRequest, getPackageRequest } from '@scorm/request';

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('scormAssign'));

  const [store, render] = useStore({
    loading: false,
    isNew: false,
    package: null,
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
      await assignPackageRequest(params.id, taskInstanceData);

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
      const { scorm } = await getPackageRequest(params.id);
      store.package = scorm;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id && !store.package) init();
  }, [params]);

  const isGradable = !!store.package?.gradable;

  if (!store.package) {
    return <Loader />;
  }

  return (
    <Form
      action={t('assign')}
      assignable={store.package}
      evaluationType={isGradable ? 'auto' : 'none'}
      evaluationTypes={isGradable ? ['calificable', 'punctuable'] : ['nonEvaluable']}
      hideMaxTime
      onSubmit={send}
      showEvaluation={isGradable}
      showMessageForStudents
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
