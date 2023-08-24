import {
  Box,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { PluginTestIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailConfig from './components/DetailConfig';
import DetailQuestions from './components/DetailQuestions';

export default function Detail(p) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));

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
      await saveQuestionBankRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/tests/questions-banks/draft');
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

  async function init() {
    try {
      store.loading = true;
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const {
          // eslint-disable-next-line camelcase
          questionBank: { deleted, deleted_at, created_at, updated_at, ...props },
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
            {store.currentStep === 0 && <DetailBasic t={t} form={form} onNext={() => setStep(1)} />}
            {store.currentStep === 1 && (
              <DetailConfig t={t} form={form} onPrev={() => setStep(0)} onNext={() => setStep(2)} />
            )}
            {store.currentStep === 2 || store.currentStep === 3 ? (
              <DetailQuestions t={t} form={form} onPrev={() => setStep(1)} onNext={saveAsPublish} />
            ) : null}
          </VerticalStepperContainer>
        </Box>
      </Stack>
    </Box>
  );
}
