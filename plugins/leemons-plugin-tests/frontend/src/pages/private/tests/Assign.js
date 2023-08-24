import React from 'react';
import { forIn, map, omit, set, uniq } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
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
import { assignTestRequest, getAssignConfigsRequest, getTestRequest } from '../../../request';
import AssignConfig from '../../../components/AssignConfig';

function parseDates(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return undefined;
}

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('testAssign'));

  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
    data: {
      metadata: {},
    },
  });

  const history = useHistory();
  const params = useParams();

  async function send() {
    const instanceData = store.data;

    try {
      await assignTestRequest(store.test.id, instanceData);

      addSuccessAlert(t('assignDone'));
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    }
  }

  async function init() {
    try {
      const [{ test }, { configs }] = await Promise.all([
        getTestRequest(params.id, { withQuestionBank: true }),
        getAssignConfigsRequest(),
      ]);
      store.configs = configs;
      store.test = test;
      store.assignable = {
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

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  React.useEffect(() => {
    if (params?.id && (!store.test || store.test.id !== params.id)) init();
  }, [params]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{ title: `${t('pageTitle')} ${store.test?.name || ''}` }}
        onResize={handleOnHeaderResize}
      />
      <Box>
        {store.assignable ? (
          <VerticalStepperContainer
            stickyAt={store.headerHeight}
            currentStep={store.currentStep}
            data={[
              { label: t('assign'), status: 'OK' },
              { label: t('config'), status: 'OK' },
            ]}
          >
            {store.currentStep === 0 && (
              <Form
                defaultValues={store.rawData}
                assignable={store.assignable}
                evaluationType="auto"
                withoutLayout
                evaluationTypes={['calificable', 'punctuable']}
                showEvaluation
                showResponses
                showMessageForStudents
                buttonsComponent={
                  <Stack fullWidth justifyContent="end">
                    <Button type="submit">{t('next')}</Button>
                  </Stack>
                }
                onlyOneSubject
                onSubmit={handleAssignment}
              />
            )}
            {store.currentStep === 1 && (
              <AssignConfig
                defaultValues={store.data.metadata}
                test={store.test}
                configs={store.configs}
                t={t}
                onBack={(e) => {
                  store.data.metadata = {
                    ...store.data.metadata,
                    ...e,
                  };
                  store.currentStep = 0;
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
            )}
          </VerticalStepperContainer>
        ) : null}
      </Box>
    </ContextContainer>
  );
}
