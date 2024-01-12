/* eslint-disable camelcase */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  useDebouncedCallback,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
// TODO: import from @common plugin
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useLayout } from '@layout/context';
import { QuestionBankIcon } from '@tests/components/Icons/QuestionBankIcon';
import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailConfig from './components/DetailConfig';
import DetailQuestions from './components/DetailQuestions';

export default function Detail(p) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const { layoutState, setLayoutState } = useLayout();

  React.useEffect(() => {
    setLayoutState({
      ...layoutState,
      hasFooter: true,
    });
  }, []);

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
      store.saving = 'duplicate';
      render();
      await saveQuestionBankRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish() {
    try {
      store.saving = 'edit';
      render();
      await saveQuestionBankRequest({ ...formValues, published: true });
      addSuccessAlert(t('published'));
      history.push('/private/tests/questions-banks');
    } catch (error) {
      console.log(error);
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
          questionBank: {
            deleted,
            deleted_at,
            created_at,
            updated_at,
            deletedAt,
            createdAt,
            updatedAt,
            ...props
          },
        } = await getQuestionBankRequest(params.id);
        if (props.questions.length > 0) {
          store.currentStep = 3;
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

  const getTitle = () => {
    if (store.isNew) return t('pageTitleNew');
    return t('pageTitle');
  };

  React.useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) init();
  }, [params]);

  form.register('questions', {
    required: t('questionRequired'),
    validate: (value) => {
      if (value.length === 0) {
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

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          icon={<QuestionBankIcon width={23} height={23} />}
          title={getTitle()}
          formTitlePlaceholder={formValues.name}
          onCancel={() => history.goBack()}
        />
      }
    >
      {/*
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
            edit: store.isValid && !store.isNew ? t('publish') : undefined,
          }}
          icon={<PluginTestIcon />}
          variant="teacher"
          onEdit={() => saveAsPublish()}
          onDuplicate={() => saveAsDraft()}
          loading={store.saving}
          onResize={handleOnHeaderResize}
        />
*/}

      <VerticalStepperContainer
        scrollRef={scrollRef}
        currentStep={
          store.currentStep === 2 && formValues.questions?.length ? 3 : store.currentStep
        }
        data={[
          { label: t('basic'), status: 'OK' },
          { label: t('config'), status: 'OK' },
          { label: t('questions'), status: 'OK' },
        ]}
        onChangeActiveIndex={setStep}
      >
        {store.currentStep === 0 && (
          <DetailBasic
            t={t}
            form={form}
            store={store}
            stepName={t('basic')}
            scrollRef={scrollRef}
            advancedConfig={{
              alwaysOpen: true,
              program: { show: true, required: false },
              subjects: { show: true, required: true, showLevel: false, maxOne: true },
            }}
            onNext={() => setStep(1)}
            onSave={saveAsDraft}
          />
        )}
        {store.currentStep === 1 && (
          <DetailConfig
            t={t}
            form={form}
            store={store}
            scrollRef={scrollRef}
            stepName={t('config')}
            onPrev={() => setStep(0)}
            onNext={() => setStep(2)}
            onSave={saveAsDraft}
          />
        )}
        {store.currentStep === 2 || store.currentStep === 3 ? (
          <DetailQuestions
            t={t}
            form={form}
            store={store}
            scrollRef={scrollRef}
            stepName={t('questions')}
            onPrev={() => setStep(1)}
            onPublish={saveAsPublish}
            onSave={saveAsDraft}
          />
        ) : null}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
