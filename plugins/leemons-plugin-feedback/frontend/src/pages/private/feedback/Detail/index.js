/* eslint-disable camelcase */
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  useDebouncedCallback,
  VerticalStepperContainer,
  AssetFeedbackIcon,
} from '@bubbles-ui/components';
// TODO: fix this import from @common plugin
import { useStore } from '@common';
import prefixPN from '@feedback/helpers/prefixPN';
import { getFeedbackRequest, saveFeedbackRequest } from '@feedback/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

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
  const scrollRef = React.useRef();
  const form = useForm();
  const formValues = form.watch();

  // ························································
  // DATA STORE HANDLERS

  async function saveAsDraft() {
    try {
      store.saving = 'draft';
      render();
      const body = { ...formValues };
      // Only for drafts allow missing required properties
      if (!body.thanksMessage) delete body.thanksMessage;
      if (!body.questions?.length) delete body.questions;

      delete body.roleDetails;

      const { feedback } = await saveFeedbackRequest({ ...body, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.replace(`/private/feedback/${feedback.id}`);
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish(goAssign) {
    try {
      store.saving = 'publish';
      render();
      const body = formValues;
      delete body.roleDetails;
      const { feedback } = await saveFeedbackRequest({ ...body, published: true });
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

  // ························································
  // INITIAL DATA LOADING

  async function init() {
    try {
      store.loading = true;
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const {
          // eslint-disable-next-line camelcase
          feedback: {
            deleted,
            deleted_at,
            created_at,
            updated_at,
            deletedAt,
            createdAt,
            updatedAt,
            roleDetails,
            ...feedback
          },
        } = await getFeedbackRequest(params.id);
        if (feedback.questions.length > 0) {
          store.currentStep = 1;
        }
        form.reset(feedback);
      }
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  // ························································
  // STEP HANDLERS

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

  const getTitle = () => {
    if (store.isNew) return t('pageTitleNew');
    return t('pageTitle');
  };

  // ························································
  // RENDER

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          icon={<AssetFeedbackIcon />}
          title={getTitle()}
          formTitlePlaceholder={formValues.name ? formValues.name : t('pageSubHeaderPlaceholder')}
          onCancel={() => history.goBack()}
          mainActionLabel={t('cancel')}
        />
      }
    >
      <VerticalStepperContainer
        scrollRef={scrollRef}
        currentStep={store.currentStep}
        data={[
          { label: t('basic'), status: 'OK' },
          { label: t('questions'), status: 'OK' },
        ]}
      >
        {store.currentStep === 0 && (
          <DetailBasic
            t={t}
            form={form}
            store={store}
            stepName={t('basic')}
            scrollRef={scrollRef}
            onSave={saveAsDraft}
            onNext={() => setStep(1)}
          />
        )}
        {store.currentStep > 0 && (
          <DetailQuestions
            t={t}
            form={form}
            store={store}
            stepName={t('questions')}
            scrollRef={scrollRef}
            onSave={saveAsDraft}
            onPublish={saveAsPublish}
            onAssign={() => saveAsPublish(true)}
            onPrev={() => {
              setStep(0);
            }}
          />
        )}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
