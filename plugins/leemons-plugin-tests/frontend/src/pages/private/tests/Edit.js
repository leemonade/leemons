import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import {
  Box,
  LoadingOverlay,
  Stack,
  VerticalStepperContainer,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import { PluginTestIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { groupBy, map, uniqBy } from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getTestRequest, saveTestRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailConfig from './components/DetailConfig';
import DetailContent from './components/DetailContent';
import DetailInstructions from './components/DetailInstructions';
import DetailQuestions from './components/DetailQuestions';
import DetailQuestionsBanks from './components/DetailQuestionsBanks';

export default function Edit() {
  const [t] = useTranslateLoader(prefixPN('testsEdit'));
  const debounce = useDebouncedCallback(1000);

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

  const form = useForm();
  const formValues = form.watch();
  store.isValid = form.formState.isValid;

  async function saveAsDraft() {
    try {
      store.saving = 'duplicate';
      render();
      const { subjects, ...toSend } = formValues;
      toSend.subjects = subjects.map(({ subject }) => subject);
      await saveTestRequest({ ...toSend, published: false });
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
      store.saving = 'edit';
      render();
      const { subjects, ...toSend } = formValues;
      toSend.subjects = subjects?.map(({ subject }) => subject);
      const { test } = await saveTestRequest({ ...toSend, published: true });
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
          // eslint-disable-next-line camelcase
          test: { deleted, deleted_at, created_at, updated_at, ...props },
        } = await getTestRequest(params.id);
        props.subjects = map(props.subjects, (subject) => ({ subject }));
        form.reset({ ...props, questions: map(props.questions, 'id') });
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

  React.useEffect(() => {
    if (params?.id) init();
  }, [params?.id]);

  let component = null;
  const steps = [
    { label: t('basic'), status: 'OK' },
    { label: t('config'), status: 'OK' },
  ];

  form.register('name', { required: t('nameRequired') });
  form.register('type', { required: t('typeRequired') });

  if (formValues.type === 'learn') {
    form.register('questionBank', { required: t('questionBankRequired') });
    form.register('questions', {
      required: t('questionsRequired'),
      min: {
        value: 1,
        message: t('questionsRequired'),
      },
    });
    form.register('statement', { required: t('statementRequired') });
    steps.push({ label: t('questionsBank'), status: 'OK' });
    steps.push({ label: t('questions'), status: 'OK' });
    steps.push({ label: t('contentLabel'), status: 'OK' });
    steps.push({ label: t('instructions'), status: 'OK' });
    if (store.currentStep === 2)
      component = (
        <DetailQuestionsBanks
          t={t}
          form={form}
          onNext={() => setStep(3)}
          onPrev={() => setStep(1)}
        />
      );
    if (store.currentStep === 3)
      component = (
        <DetailQuestions t={t} form={form} onNext={() => setStep(4)} onPrev={() => setStep(2)} />
      );
    if (store.currentStep === 4)
      component = (
        <DetailContent
          store={store}
          t={t}
          form={form}
          onNext={() => setStep(5)}
          onPrev={() => setStep(3)}
        />
      );
    if (store.currentStep === 5)
      component = (
        <DetailInstructions
          t={t}
          form={form}
          onPublish={() => saveAsPublish()}
          onAssign={() => saveAsPublish(true)}
          onPrev={() => setStep(4)}
        />
      );
  }

  const handleOnHeaderResize = (size) => {
    store.headerHeight = size?.height - 1;
    render();
  };

  return (
    <Stack direction="column" fullHeight>
      {store.loading ? <LoadingOverlay visible /> : null}
      <AdminPageHeader
        values={{
          // eslint-disable-next-line no-nested-ternary
          title: formValues.name
            ? formValues.name
            : store.isNew
            ? t('pageTitleNew')
            : t('pageTitle', { name: formValues.name }),
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

      <Box>
        <VerticalStepperContainer
          stickyAt={store.headerHeight}
          currentStep={store.currentStep}
          data={steps}
          onChangeActiveIndex={setStep}
        >
          {store.currentStep === 0 && (
            <DetailBasic
              t={t}
              advancedConfig={{
                alwaysOpen: true,
                fileToRight: true,
                colorToRight: true,
                program: { show: true, required: false },
                subjects: { show: true, required: true, showLevel: false, maxOne: true },
              }}
              form={form}
              onNext={() => setStep(1)}
            />
          )}
          {store.currentStep === 1 && (
            <DetailConfig
              store={store}
              t={t}
              form={form}
              onNext={() => setStep(2)}
              onPrev={() => setStep(0)}
            />
          )}
          {component}
        </VerticalStepperContainer>
      </Box>
    </Stack>
  );
}
