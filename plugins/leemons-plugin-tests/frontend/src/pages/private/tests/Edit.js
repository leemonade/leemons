/* eslint-disable camelcase */
import React from 'react';
import { groupBy, map, uniqBy } from 'lodash';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import {
  LoadingOverlay,
  VerticalStepperContainer,
  TotalLayoutContainer,
  TotalLayoutHeader,
} from '@bubbles-ui/components';
import { PluginTestIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { getTestRequest, saveTestRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailContent from './components/DetailContent';
import DetailInstructions from './components/DetailInstructions';
import DetailQuestions from './components/DetailQuestions';
import DetailQuestionsBanks from './components/DetailQuestionsBanks';

export default function Edit() {
  const [t] = useTranslateLoader(prefixPN('testsEdit'));

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
  store.isValid = form.formState.isValid;

  async function saveAsDraft() {
    try {
      store.saving = 'draft';
      render();
      const { subjects, ...toSend } = formValues;
      toSend.subjects = subjects?.map(({ subject }) => subject);
      // console.log('toSend', toSend);
      await saveTestRequest({ ...toSend, type: 'learn', published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/tests/draft');
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
      const { subjects, ...toSend } = formValues;
      toSend.subjects = subjects?.map(({ subject }) => subject);
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
      addErrorAlert(error);
    }
  }

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

  React.useEffect(() => {
    if (params?.id) init();
  }, [params?.id]);

  const steps = React.useMemo(() => {
    const data = [
      { label: t('basic'), status: 'OK' },
      { label: t('contentLabel'), status: 'OK' },
      { label: t('questionsBank'), status: 'OK' },
      { label: t('questions'), status: 'OK' },
    ];
    const { config = {} } = formValues;
    if (config.hasCurriculum || config.hasObjectives) {
      data.push({ label: 'Evaluación', status: 'OK' });
    }
    if (config.hasResources || config.hasInstructions) {
      let labelKey = 'instructions';
      if (config.hasResources) labelKey = 'resources';
      if (config.hasResources && config.hasInstructions) {
        labelKey = 'resoucesAndInstructions';
      }
      data.push({ label: t(labelKey), status: 'OK' });
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
          icon={<PluginTestIcon />}
          title={getTitle()}
          formTitlePlaceholder={formValues.name}
        />
      }
    >
      {/* 
      <AdminPageHeader
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
        currentStep={store.currentStep}
        data={steps}
        onChangeActiveIndex={setStep}
        scrollRef={scrollRef}
      >
        {
          [
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
              key="s4"
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
              stepName={t('questions')}
              scrollRef={scrollRef}
              onSave={saveAsDraft}
              onNext={nextStep}
              onPrev={prevStep}
            />,
            <DetailInstructions
              key="s5"
              t={t}
              form={form}
              store={store}
              stepName={t('instructions')}
              scrollRef={scrollRef}
              onSave={saveAsDraft}
              onPublish={saveAsPublish}
              onAssign={() => saveAsPublish(true)}
              onPrev={prevStep}
            />,
          ][store.currentStep]
        }
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
