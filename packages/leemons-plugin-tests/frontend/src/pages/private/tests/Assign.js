import React from 'react';
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
import { addErrorAlert } from '@layout/alert';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { map } from 'lodash';
import Form from '@assignables/components/Assignment/Form';
import { getTestRequest } from '../../../request';

export default function Assign() {
  const [t] = useTranslateLoader(prefixPN('testAssign'));

  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
    data: {},
  });

  const history = useHistory();
  const params = useParams();

  async function init() {
    try {
      const { test } = await getTestRequest(params.id, { withQuestionBank: true });
      store.test = test;
      console.log(test);
      store.assignable = {
        subjects: map(test.subjects, (id) => ({
          subject: id,
        })),
      };
      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  function handleAssignment(e) {
    store.data = { ...store.data, ...e };
    store.currentStep = 1;
    render();
  }

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  React.useEffect(() => {
    if (params?.id) init();
  }, [params]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{ title: `${t('pageTitle')} ${store.test?.name}` }}
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
                onSubmit={handleAssignment}
                assignable={store.assignable}
                sendButton={
                  <Stack fullWidth justifyContent="end">
                    <Button type="submit">{t('next')}</Button>
                  </Stack>
                }
              />
            )}
            {store.currentStep === 1 && Hola}
          </VerticalStepperContainer>
        ) : null}
      </Box>
    </ContextContainer>
  );
}
