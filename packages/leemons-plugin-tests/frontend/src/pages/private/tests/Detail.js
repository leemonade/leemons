import React from 'react';
import {
  ContextContainer,
  PageContainer,
  Stepper,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { map } from 'lodash';
import DetailConfig from './components/DetailConfig';
import { getTestRequest, saveTestRequest } from '../../../request';
import DetailDesign from './components/DetailDesign';
import DetailQuestionsBanks from './components/DetailQuestionsBanks';
import DetailQuestions from './components/DetailQuestions';
import DetailContent from './components/DetailContent';
import DetailInstructions from './components/DetailInstructions';

export default function Detail() {
  const [t] = useTranslateLoader(prefixPN('testsDetail'));
  const debounce = useDebouncedCallback(1000);

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
    isNew: false,
  });

  const history = useHistory();
  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  async function saveAsDraft() {
    try {
      store.saving = 'edit';
      render();
      await saveTestRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/tests');
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish() {
    try {
      store.saving = 'duplicate';
      render();
      await saveTestRequest({ ...formValues, published: true });
      addSuccessAlert(t('published'));
      history.push('/private/tests');
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
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
        form.reset({ ...props, questions: map(props.questions, 'id') });
      }
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id) init();
  }, [params]);

  const steps = [
    {
      label: t('config'),
      content: <DetailConfig t={t} form={form} />,
    },
  ];

  if (formValues.type) {
    steps.push({
      label: t('design'),
      content: <DetailDesign t={t} form={form} />,
    });
  }

  form.register('name', { required: t('nameRequired') });
  form.register('type', { required: t('typeRequired') });
  form.register('tagline', { required: t('taglineRequired') });
  form.register('summary', { required: t('summaryRequired') });

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
    steps.push({
      label: t('questionsBank'),
      content: <DetailQuestionsBanks t={t} form={form} />,
    });
    steps.push({
      label: t('questions'),
      content: <DetailQuestions t={t} form={form} />,
    });
    steps.push({
      label: t('contentLabel'),
      content: <DetailContent t={t} form={form} />,
    });
    steps.push({
      label: t('instructions'),
      content: <DetailInstructions t={t} form={form} />,
    });
  }

  React.useEffect(() => {
    const subscription = form.watch(() => {
      debounce(async () => {
        store.isValid = await form.trigger();
        render();
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: store.isNew ? t('pageTitleNew') : t('pageTitle', { name: formValues.name }),
        }}
        buttons={{
          edit: formValues.name && !formValues.published ? t('saveDraft') : undefined,
          duplicate: store.isValid ? t('publish') : undefined,
        }}
        onDuplicate={() => saveAsPublish()}
        onEdit={() => saveAsDraft()}
        loading={store.saving}
      />

      <PageContainer noFlex>
        <Stepper data={steps} />
      </PageContainer>
    </ContextContainer>
  );
}
