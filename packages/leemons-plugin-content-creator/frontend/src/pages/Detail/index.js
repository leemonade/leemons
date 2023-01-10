import React from 'react';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { DocumentIcon, SetupContent } from '@content-creator/components/icons';
import prefixPN from '@content-creator/helpers/prefixPN';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import { saveDocumentRequest, getDocumentRequest } from '@content-creator/request';

export default function Index() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS

  const debounce = useDebouncedCallback(1000);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    headerHeight: null,
    titleValue: '',
    document: {},
  });

  const history = useHistory();
  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  async function saveAsDraft() {
    try {
      store.saving = 'duplicate';
      render();
      await saveDocumentRequest({ ...formValues, published: false });
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
      const { document } = await saveDocumentRequest({ ...formValues, published: true });
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
        } = await getDocumentRequest(params.id);

        store.titleValue = props.name;
        store.document = { ...props };
        form.reset(props);
      }
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  const setTitleIfItsUndefined = (value, forceTitle) => {
    const parser = new DOMParser();
    const htmlContent = parser.parseFromString(value, 'text/html').body.getElementsByTagName('*');
    const firstElement = htmlContent[0]?.innerHTML;
    if (!store.titleValue || forceTitle) form.setValue('name', firstElement);
  };

  const onTitleChangeHandler = (value) => {
    form.setValue('name', value);
    store.titleValue = value;
    render();
  };

  const onContentChangeHandler = (value) => {
    setTitleIfItsUndefined(value);
    form.setValue('content', value);
  };

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
  if (store.loading || tLoading) return <LoadingOverlay visible />;

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <Stack direction="column" fullHeight>
        <PageHeader
          placeholders={{ title: t('titlePlaceholder') }}
          values={{
            // eslint-disable-next-line no-nested-ternary
            title: formValues.name,
          }}
          buttons={{
            duplicate: t('saveDraft'),
            edit: t('publish'),
          }}
          buttonsIcons={{
            edit: <SetupContent size="16" />,
          }}
          isEditMode={store.isNew}
          icon={<DocumentIcon />}
          onChange={onTitleChangeHandler}
          onEdit={() => saveAsPublish()}
          onDuplicate={() => saveAsDraft()}
          loading={store.saving}
          onResize={handleOnHeaderResize}
          fullWidth
        />
        <ContentEditorInput
          useSchema
          labels={{
            format: t('formatLabel'),
            // schema: t('schemaLabel')
          }}
          onChange={onContentChangeHandler}
          value={formValues.content}
        />
      </Stack>
    </Box>
  );
}
