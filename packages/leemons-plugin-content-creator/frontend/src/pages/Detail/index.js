import React from 'react';
import { Box, LoadingOverlay, Stack, useDebouncedCallback } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { DocumentIcon } from '@content-creator/components/icons';
import prefixPN from '@content-creator/helpers/prefixPN';

export default function Index() {
  const [t] = useTranslateLoader(prefixPN('contentCreatorDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS

  const debounce = useDebouncedCallback(1000);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
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
      // await saveFeedbackRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/content-creator');
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish(goAssign) {
    try {
      store.saving = 'edit';
      render();
      // const { feedback } = await saveFeedbackRequest({ ...formValues, published: true });
      const { document } = {};
      addSuccessAlert(t('published'));
      if (goAssign) {
        history.push(`/private/content-creator/assign/${document.id}`);
      } else {
        history.push('/private/content-creator');
      }
    } catch (error) {
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
          document: { deleted, deleted_at, created_at, updated_at, ...props },
        } = {}; // await getFeedbackRequest(params.id);

        form.reset(props);
      }
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) init();
  }, [params]);

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
            // edit: store.isValid && !store.isNew ? t('publish') : undefined,
          }}
          icon={<DocumentIcon />}
          variant="teacher"
          onEdit={() => saveAsPublish()}
          onDuplicate={() => saveAsDraft()}
          loading={store.saving}
          onResize={handleOnHeaderResize}
        />

        <Box>Hola Mundo</Box>
      </Stack>
    </Box>
  );
}
