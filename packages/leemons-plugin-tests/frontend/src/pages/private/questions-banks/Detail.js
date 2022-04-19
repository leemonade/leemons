import React from 'react';
import { ContextContainer, PageContainer, Stepper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import DetailConfig from './components/DetailConfig';
import DetailDesign from './components/DetailDesign';
import DetailQuestions from './components/DetailQuestions';
import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';

export default function Detail() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));

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

  React.useEffect(() => {
    if (params?.id) init();
  }, [params]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: store.isNew ? t('pageTitleNew') : t('pageTitle', { name: formValues.name }),
        }}
        buttons={{
          edit: formValues.name && !formValues.published ? t('saveDraft') : undefined,
          duplicate:
            store.isNew && formValues.questions?.length
              ? t('publish')
              : formValues.questions?.length
              ? t('publish')
              : undefined,
        }}
        onDuplicate={() => saveAsPublish()}
        onEdit={() => saveAsDraft()}
        loading={store.saving}
      />

      <PageContainer noFlex>
        <Stepper
          data={[
            {
              label: t('config'),
              content: <DetailConfig t={t} form={form} store={store} render={render} />,
            },
            {
              label: t('design'),
              content: <DetailDesign t={t} form={form} store={store} render={render} />,
            },
            {
              label: t('questions'),
              content: <DetailQuestions t={t} form={form} store={store} render={render} />,
            },
          ]}
        />
      </PageContainer>
    </ContextContainer>
  );
}
