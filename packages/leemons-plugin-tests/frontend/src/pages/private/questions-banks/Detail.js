import React from 'react';
import { ContextContainer, PageContainer, Stepper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DetailConfig from './components/DetailConfig';
import DetailDesign from './components/DetailDesign';
import DetailQuestions from './components/DetailQuestions';

export default function Detail() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
    isNew: false,
  });

  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  function saveAsDraft() {}

  async function init() {
    store.isNew = params.id === 'new';
    render();
  }

  React.useEffect(() => {
    if (params?.id) init();
  }, [params]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: store.isNew ? t('pageTitleNew') : t('pageTitle'),
        }}
        buttons={{
          edit: t('saveDraft'),
          duplicate: store.isNew && formValues.questions?.length ? t('publish') : undefined,
        }}
        onEdit={() => saveAsDraft()}
      />

      <PageContainer noFlex>
        <Stepper
          data={[
            {
              label: t('questions'),
              content: <DetailQuestions t={t} form={form} store={store} render={render} />,
            },
            {
              label: t('config'),
              content: <DetailConfig t={t} form={form} store={store} render={render} />,
            },
            {
              label: t('design'),
              content: <DetailDesign t={t} form={form} store={store} render={render} />,
            },
          ]}
        />
      </PageContainer>
    </ContextContainer>
  );
}
