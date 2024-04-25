/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { groupBy, isString, map, uniqBy } from 'lodash';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useLayout } from '@layout/context';
import { TestIcon } from '@tests/components/Icons/TestIcon';
import { getTestRequest, saveTestRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailContent from './components/DetailContent';
import DetailEvaluation from './components/DetailEvaluation';
import DetailInstructions from './components/DetailInstructions';
import DetailQuestions from './components/DetailQuestions';
import DetailQuestionsBanks from './components/DetailQuestionsBanks';

export default function Edit() {
  const [t] = useTranslateLoader(prefixPN('testsEdit'));
  const { layoutState, setLayoutState } = useLayout();

  useEffect(() => {
    setLayoutState({
      ...layoutState,
      hasFooter: true,
    });
  }, []);

  // ························································
  // SETTINGS
  const [isNewQBankSelected, setIsNewQBankSelected] = React.useState(false);
  const [store, render] = useStore({
    loading: true,
    saving: null,
    isNew: false,
    currentStep: 0,
    headerHeight: null,
  });

  const history = useHistory();
  const params = useParams();
  const scrollRef = React.useRef();
  const form = useForm();
  const formValues = form.watch();
  store.isValid = form.formState.isValid;

  // ························································
  // DATA STORE HANDLERS

  async function saveAsDraft() {
    try {
      store.saving = 'draft';
      render();

      const { subjects, subjectsRaw, ...toSend } = formValues;
      toSend.subjects = subjects?.map((subject) => (isString(subject) ? subject : subject.subject));
      toSend.cover = toSend.cover?.id ?? toSend.cover;

      const { test } = await saveTestRequest({ ...toSend, type: 'learn', published: false });
      addSuccessAlert(t('savedAsDraft'));
      if (store.isNew) {
        history.replace(`/private/tests/${test.id}`);
      }
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish(redictToAssign = false) {
    try {
      store.saving = 'publish';
      render();
      const { subjects, subjectsRaw, ...toSend } = formValues;
      toSend.subjects = subjects?.map((subject) => (isString(subject) ? subject : subject.subject));
      toSend.cover = toSend.cover?.id ?? toSend.cover;

      const { test } = await saveTestRequest({ ...toSend, type: 'learn', published: true });
      addSuccessAlert(t('published'));
      if (redictToAssign) {
        history.push(`/private/tests/assign/${test.id}`);
      } else {
        history.push('/private/tests');
      }
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  // ························································
  // INITIAL DATA LOADING

  async function load() {
    const [{ programs }, { classes }] = await Promise.all([
      getUserProgramsRequest(),
      listSessionClassesRequest(),
    ]);

    store.subjects = uniqBy(map(classes, 'subject'), 'id');
    store.subjectsByProgram = groupBy(
      map(store.subjects, (item) => ({
        value: item.id,
        label: item.name,
        program: item.program,
      })),
      'program'
    );
    store.programs = programs;
    store.programsData = map(programs, ({ id, name }) => ({ value: id, label: name }));
    render();
  }

  async function init() {
    try {
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const {
          test: {
            deleted,
            deleted_at,
            created_at,
            updated_at,
            deletedAt,
            createdAt,
            updatedAt,
            ...test
          },
        } = await getTestRequest(params.id);
        test.subjects = map(test.subjects, (subject) => ({ subject }));
        form.reset({
          ...test,
          type: 'learn',
          questions: map(test.questions, 'id'),
        });
      }
      await load();
      store.loading = false;
      render();
    } catch (error) {
      // addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id) init();
  }, [params?.id]);

  // ························································
  // STEP HANDLERS

  function setStep(step) {
    store.currentStep = step;
    render();
  }

  function nextStep() {
    store.currentStep += 1;
    render();
  }

  function prevStep() {
    store.currentStep -= 1;
    render();
  }

  function getInstructionsLabelKey() {
    const { config = {} } = formValues;
    if (config.hasResources || config.hasInstructions) {
      let labelKey = 'instructions';
      if (config.hasResources) labelKey = 'resources';
      if (config.hasResources && config.hasInstructions) {
        labelKey = 'resoucesAndInstructions';
      }
      return labelKey;
    }
    return null;
  }

  const steps = React.useMemo(() => {
    const data = [
      { label: t('basic'), status: 'OK' },
      { label: t('contentLabel'), status: 'OK' },
      { label: t('questionsBank'), status: 'OK' },
      { label: t('questionsStepName'), status: 'OK' },
    ];
    const { config = {} } = formValues;
    if (config.hasCurriculum || config.hasObjectives) {
      data.push({ label: t('evaluation'), status: 'OK' });
    }
    if (config.hasResources || config.hasInstructions) {
      data.push({ label: t(getInstructionsLabelKey()), status: 'OK' });
    }
    return data;
  }, [t, formValues]);

  form.register('name', { required: t('nameRequired') });
  form.register('questionBank', { required: t('questionBankRequired') });
  form.register('questions', {
    required: t('questionsRequired'),
    min: {
      value: 1,
      message: t('questionsRequired'),
    },
  });
  form.register('statement', { required: t('statementRequired') });

  const getTitle = () => {
    if (store.isNew) return t('pageTitleNew');
    return t('pageTitleEdit');
  };
  const hasOptionalSteps = () => {
    const { config = {} } = formValues;
    return config.hasInstructions || config.hasResources || config.hasObjectives;
  };

  const stepsContent = React.useMemo(() => {
    const { config = {} } = formValues;
    const result = [
      <DetailBasic
        key="s0"
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
        onNext={nextStep}
        onSave={saveAsDraft}
      />,
      <DetailContent
        key="s1"
        t={t}
        form={form}
        store={store}
        stepName={t('contentLabel')}
        scrollRef={scrollRef}
        onSave={saveAsDraft}
        onNext={nextStep}
        onPrev={prevStep}
      />,
      <DetailQuestionsBanks
        key="s2"
        t={t}
        form={form}
        store={store}
        isNewQBankSelected={isNewQBankSelected}
        setIsNewQBankSelected={setIsNewQBankSelected}
        stepName={t('questionsBank')}
        scrollRef={scrollRef}
        onSave={saveAsDraft}
        onNext={nextStep}
        onPrev={prevStep}
      />,
      <DetailQuestions
        key="s3"
        t={t}
        form={form}
        store={store}
        isNewQBankSelected={isNewQBankSelected}
        setIsNewQBankSelected={setIsNewQBankSelected}
        stepName={t('questionsStepName')}
        scrollRef={scrollRef}
        onSave={saveAsDraft}
        onNext={nextStep}
        onPrev={prevStep}
        onPublish={saveAsPublish}
        onAssign={() => saveAsPublish(true)}
        isLastStep={!hasOptionalSteps()}
      />,
    ];

    if (config.hasCurriculum || config.hasObjectives) {
      result.push(
        <DetailEvaluation
          t={t}
          key="s4"
          form={form}
          store={store}
          stepName={t('evaluation')}
          scrollRef={scrollRef}
          onSave={saveAsDraft}
          onPublish={saveAsPublish}
          onAssign={() => saveAsPublish(true)}
          onPrev={prevStep}
          onNext={nextStep}
          isLastStep={!config.hasResources && !config.hasInstructions}
        />
      );
    }
    if (config.hasResources || config.hasInstructions) {
      result.push(
        <DetailInstructions
          key="s5"
          t={t}
          form={form}
          store={store}
          hasResources={config.hasResources}
          hasInstructions={config.hasInstructions}
          stepName={t(getInstructionsLabelKey())}
          scrollRef={scrollRef}
          onSave={saveAsDraft}
          onPublish={saveAsPublish}
          onAssign={() => saveAsPublish(true)}
          onPrev={prevStep}
        />
      );
    }
    return result;
  }, [form, formValues, t, store, scrollRef, hasOptionalSteps]);

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
          icon={<TestIcon width={23} height={23} />}
          title={getTitle()}
          formTitlePlaceholder={formValues.name ? formValues.name : t('headerTitlePlaceholder')}
          onCancel={() => history.goBack()}
          mainActionLabel={t('cancel')}
        />
      }
    >
      <VerticalStepperContainer
        currentStep={store.currentStep}
        data={steps}
        onChangeActiveIndex={setStep}
        scrollRef={scrollRef}
      >
        {stepsContent[store.currentStep]}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
