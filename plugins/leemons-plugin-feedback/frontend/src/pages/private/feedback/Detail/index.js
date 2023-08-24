import {
  Box,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { PluginFeedbackIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import prefixPN from '@feedback/helpers/prefixPN';
import { getFeedbackRequest, saveFeedbackRequest } from '@feedback/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import DetailBasic from '@feedback/pages/private/feedback/Detail/components/DetailBasic';
import DetailQuestions from '@feedback/pages/private/feedback/Detail/components/DetailQuestions';
import { useForm } from 'react-hook-form';

export default function Index() {
  const [t] = useTranslateLoader(prefixPN('feedbackDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS
  const debounce = useDebouncedCallback(1000);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
    headerHeight: null,
  });

  const history = useHistory();
  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  async function saveAsDraft() {
    try {
      store.saving = 'duplicate';
      render();
      await saveFeedbackRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/feedback/draft');
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish(goAssign) {
    try {
      store.saving = 'edit';
      render();
      const { feedback } = await saveFeedbackRequest({ ...formValues, published: true });
      addSuccessAlert(t('published'));
      if (goAssign) {
        history.push(`/private/feedback/assign/${feedback.id}`);
      } else {
        history.push('/private/feedback');
      }
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function init() {
    try {
      store.loading = true;
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const {
          // eslint-disable-next-line camelcase
          feedback: { deleted, deleted_at, created_at, updated_at, ...props },
        } = await getFeedbackRequest(params.id);
        if (props.questions.length > 0) {
          store.currentStep = 1;
        }
        form.reset(props);
      }
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  function setStep(step) {
    store.currentStep = step;
    render();
  }

  React.useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) init();
  }, [params]);

  form.register('questions', {
    required: t('questionRequired'),
    validate: (value) => {
      if (!value?.length) {
        return t('questionRequired');
      }
      return undefined;
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(() => {
      debounce(async () => {
        store.isValid = await form.trigger();
        render();
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <Stack direction="column" fullHeight>
        <AdminPageHeader
          values={{
            // eslint-disable-next-line no-nested-ternary
            title: formValues.name
              ? formValues.name
              : store.isNew
              ? t('pageTitleNew', { name: '' })
              : t('pageTitle', { name: '' }),
          }}
          buttons={{
            duplicate: formValues.name && !formValues.published ? t('saveDraft') : undefined,
            // edit: store.isValid && !store.isNew ? t('publish') : undefined,
          }}
          icon={<PluginFeedbackIcon />}
          variant="teacher"
          onEdit={() => saveAsPublish()}
          onDuplicate={() => saveAsDraft()}
          loading={store.saving}
          onResize={handleOnHeaderResize}
        />

        <Box>
          <VerticalStepperContainer
            stickyAt={store.headerHeight}
            currentStep={
              store.currentStep === 1 && formValues.questions?.length ? 2 : store.currentStep
            }
            data={[
              { label: t('basic'), status: 'OK' },
              { label: t('questions'), status: 'OK' },
            ]}
          >
            {store.currentStep === 0 && <DetailBasic t={t} form={form} onNext={() => setStep(1)} />}
            {store.currentStep > 0 && (
              <DetailQuestions
                t={t}
                form={form}
                saving={store.saving}
                onNext={saveAsPublish}
                onPrev={() => {
                  setStep(0);
                }}
              />
            )}
          </VerticalStepperContainer>
        </Box>
      </Stack>
    </Box>
  );
}
