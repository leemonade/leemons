/* eslint-disable camelcase */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { isEmpty, omit } from 'lodash';
import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
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

  console.log('formValues', formValues);

  const prepareDataToSave = () => {
    const qbank = omit(formValues, 'subjectsRaw');
    // Clear questions clues
    qbank.questions = qbank.questions?.map((question) => {
      const newQuestion = { ...question };
      if (isEmpty(newQuestion.clues)) {
        newQuestion.clues = [];
      } else {
        newQuestion.clues = [{ value: newQuestion.clues[0].value ?? newQuestion.clues[0] }];
      }
      return newQuestion;
    });
    return qbank;
  };

  // ························································
  // DATA STORE HANDLERS

  async function saveAsDraft() {
    try {
      store.saving = 'draft';
      render();
      const body = prepareDataToSave();
      const { questionBank } = await saveQuestionBankRequest({ ...body, published: false });
      addSuccessAlert(t('savedAsDraft'));
      if (store.isNew) {
        history.replace(`/private/tests/questions-banks/${questionBank.id}`);
      }
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish() {
    try {
      store.saving = 'publish';
      render();
      const body = prepareDataToSave();
      await saveQuestionBankRequest({ ...body, published: true });
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
            ...qbank
          },
        } = await getQuestionBankRequest(params.id);

        if (qbank.questions.length > 0) {
          store.currentStep = 1;

          // Clear questions clues
          qbank.questions = qbank.questions.map((question) => {
            const newQuestion = { ...question };
            if (isEmpty(newQuestion.clues)) {
              newQuestion.clues = [];
            } else if (Object.keys(newQuestion.clues[0]).length === 0) {
              newQuestion.clues = [];
            } else {
              newQuestion.clues = [newQuestion.clues[0].value];
            }
            return newQuestion;
          });
        }
        form.reset(qbank);
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

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          icon={<QuestionBankIcon width={23} height={23} />}
          title={getTitle()}
          formTitlePlaceholder={formValues.name ? formValues.name : t('headerTitlePlaceholder')}
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
        {store.currentStep === 1 || store.currentStep === 2 ? (
          <DetailQuestions
            t={t}
            form={form}
            store={store}
            scrollRef={scrollRef}
            stepName={t('questions')}
            onPrev={() => setStep(0)}
            onPublish={saveAsPublish}
            onSave={saveAsDraft}
          />
        ) : null}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
