import React from 'react';
import {
  Box,
  ContextContainer,
  PageContainer,
  useDebouncedCallback,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { PluginTestIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';
import DetailQuestions from './components/DetailQuestions';
import DetailBasic from './components/DetailBasic';
import DetailConfig from './components/DetailConfig';

export default function Detail() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS
  const debounce = useDebouncedCallback(1000);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
  });

  const history = useHistory();
  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  async function saveAsDraft() {
    try {
      store.saving = 'edit';
      render();
      await saveQuestionBankRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/tests/questions-banks');
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
      await saveQuestionBankRequest({ ...formValues, published: true });
      addSuccessAlert(t('published'));
      history.push('/private/tests/questions-banks');
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
          questionBank: { deleted, deleted_at, created_at, updated_at, ...props },
        } = await getQuestionBankRequest(params.id);
        form.reset(props);
      }
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
  }, [params]);

  form.register('questions', {
    required: true,
    validate: (value) => {
      if (value.length === 0) {
        return true;
      }
      return undefined;
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(() => {
      debounce(async () => {
        console.log(form.getValues());
        store.isValid = await form.trigger();
        console.log(form.formState.errors);
        render();
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <ContextContainer fullHeight>
        <AdminPageHeader
          values={{
            title: store.isNew
              ? t('pageTitleNew', { name: formValues.name || '' })
              : t('pageTitle', { name: formValues.name || '' }),
          }}
          buttons={{
            duplicate: formValues.name && !formValues.published ? t('saveDraft') : undefined,
            edit: store.isValid ? t('publish') : undefined,
          }}
          icon={<PluginTestIcon />}
          variant="teacher"
          onEdit={() => saveAsPublish()}
          onDuplicate={() => saveAsDraft()}
          loading={store.saving}
        />

        <PageContainer noFlex>
          <VerticalStepperContainer
            currentStep={
              store.currentStep === 2 && formValues.questions?.length ? 3 : store.currentStep
            }
            data={[
              { label: t('basic'), status: 'OK' },
              { label: t('config'), status: 'OK' },
              { label: t('questions'), status: 'OK' },
            ]}
          >
            {store.currentStep === 0 && <DetailBasic t={t} form={form} onNext={() => setStep(1)} />}
            {store.currentStep === 1 && (
              <DetailConfig t={t} form={form} onNext={() => setStep(2)} />
            )}
            {store.currentStep === 2 || store.currentStep === 3 ? (
              <DetailQuestions t={t} form={form} />
            ) : null}
          </VerticalStepperContainer>
        </PageContainer>
      </ContextContainer>
    </Box>
  );
}
