import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Form from '@assignables/components/Assignment/Form';
import getAssignablesRequest from '@assignables/requests/assignables/getAssignables';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { map } from 'lodash';

import AssignConfig from '../../../components/AssignConfig';
import {
  assignTestRequest,
  getAssignConfigsRequest,
  getTestRequest,
  deleteAssignedConfigRequest,
  updateAssignedConfigRequest,
} from '../../../request';

import { RulesConfig } from '@tests/components/RulesConfig';
import prefixPN from '@tests/helpers/prefixPN';

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('testAssign'));

  const [store, render] = useStore({
    loading: false,
    isNew: false,
    data: {
      metadata: {},
    },
  });
  const history = useHistory();
  const params = useParams();

  async function send() {
    store.loading = true;
    render();

    const instanceData = store.data;

    try {
      await assignTestRequest(store.test.id, instanceData);
      addSuccessAlert(t('assignDone'));
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    } finally {
      store.loading = false;
      render();
    }
  }

  async function init() {
    try {
      const [{ test }, { configs }, [{ roleDetails }]] = await Promise.all([
        getTestRequest(params.id, { withQuestionBank: true }),
        getAssignConfigsRequest(),
        getAssignablesRequest(params.id, { withFiles: false }),
      ]);
      const coverUrl = test?.cover?.id ? getFileUrl(test.cover.id) : null;
      store.configs = configs;
      store.test = test;
      store.assignable = {
        asset: {
          name: test.name,
          cover: coverUrl,
        },
        roleDetails,
        subjects: map(test.subjects, (id, i) => ({
          subject: id,
          program: test.program,
          // EN: As long as curriculum is not subject-specific, we provide it in the first subject, so less calculations are needed.
          // ES: Mientras que el curriculum no sea específico por asignatura, se proporciona en la primera asignatura, por lo que se hace menos cálculos.
          curriculum: i === 0 ? test.curriculum : undefined,
        })),
      };
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  function handleAssignment(e) {
    const { value, raw } = e;
    store.data = { ...store.data, ...value };
    store.rawData = raw;
    store.currentStep = 1;
    render();
  }

  function onNextStep() {
    store.currentStep += 1;
    render();
  }

  async function handleDeleteAssignmentConfig(id) {
    try {
      await deleteAssignedConfigRequest(id);
      addSuccessAlert(t('deletedConfig'));
    } catch (e) {
      addErrorAlert(e.message);
    }
    const { configs } = await getAssignConfigsRequest();
    store.configs = configs;
    render();

    // store.configs = store.configs.filter((c) => c.id !== id);
    // render();
  }

  async function handleUpdateAssignmentConfig(id, name, config) {
    try {
      await updateAssignedConfigRequest(id, name, config);
      addSuccessAlert(t('updatedConfig'));
    } catch (e) {
      addErrorAlert(e.message);
    }
    const { configs } = await getAssignConfigsRequest();
    store.configs = configs;
    render();
  }

  React.useEffect(() => {
    if (params?.id && (!store.test || store.test.id !== params.id)) init();
  }, [params]);

  return (
    <Form
      defaultValues={store.rawData}
      assignable={store.assignable}
      evaluationType="auto"
      evaluationTypes={['calificable', 'punctuable']}
      showEvaluation
      showResponses
      showMessageForStudents
      onlyOneSubject
      onSubmit={handleAssignment}
    >
      <AssignConfig
        stepName={t('questions')}
        defaultValues={store.data.metadata}
        data={store.rawData}
        test={store.test}
        assignable={store.assignable}
        configs={store.configs}
        loading={store.loading}
        t={t}
        onSave={(e) => {
          store.data.metadata = {
            ...store.data.metadata,
            ...e,
          };
          render();
        }}
        onNextStep={() => {
          onNextStep();
        }}
      />
      <RulesConfig
        stepName={t('rules')}
        defaultValues={store.data?.metadata?.filters}
        onDeleteConfig={handleDeleteAssignmentConfig}
        onUpdateConfig={handleUpdateAssignmentConfig}
        test={store.test}
        assignable={store.assignable}
        data={store.rawData}
        configs={store.configs}
        loading={store.loading}
        t={t}
        onSave={(e) => {
          store.data.metadata = {
            ...store.data.metadata,
            ...e,
          };
          render();
        }}
        onSend={(e) => {
          let filters = {
            wrong: 0,
            canOmitQuestions: true,
            allowClues: true,
            omit: 0,
            clues: [
              {
                type: 'hide-response',
                value: 0,
                canUse: true,
              },
              { type: 'note', value: 0, canUse: true },
            ],
          };
          if (store.data.metadata.filters) {
            filters = { ...filters, ...store.data.metadata.filters };
          }
          if (e.filters) {
            filters = { ...filters, ...e.filters };
          }
          store.data.metadata = {
            ...store.data.metadata,
            ...e,
            filters,
          };
          send();
        }}
      />
    </Form>
  );
}
