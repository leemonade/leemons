import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore, useProcessTextEditor } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { DocumentIcon, SetupContent } from '@content-creator/components/icons';
import prefixPN from '@content-creator/helpers/prefixPN';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import {
  saveDocumentRequest,
  getDocumentRequest,
  // shareDocumentRequest,
} from '@content-creator/request';
import { AssetFormInput } from '@leebrary/components';
// import { PermissionsDataDrawer } from '@leebrary/components/AssetSetup';
// import prepareAsset from '@leebrary/helpers/prepareAsset';
import { PageContent } from './components/PageContent/PageContent';

export default function Index({ readOnly, isNew }) {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  const processTextEditor = useProcessTextEditor();

  // ----------------------------------------------------------------------
  // SETTINGS

  const debounce = useDebouncedCallback(1000);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    titleValue: '',
    document: {},
    preparedAsset: {},
    isConfigPage: false,
    openShareDrawer: false,
  });

  const history = useHistory();
  const params = useParams();

  if (isNew) {
    params.id = 'new';
  }

  const form = useForm();
  const formValues = form.watch();

  async function saveAsDraft() {
    try {
      store.saving = 'duplicate';
      render();

      const content = await processTextEditor(formValues.content, store.document.content, {
        force: !!store.published,
      });

      await saveDocumentRequest({ ...formValues, content, published: false });
      addSuccessAlert(t('savedAsDraft'));
      history.push('/private/leebrary/assignables.content-creator/list?activeTab=draft');
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

      const content = await processTextEditor(formValues.content, store.document.content, {
        force: !!store.published,
      });

      const { document: documentRequest } = await saveDocumentRequest({
        ...formValues,
        content,
        published: true,
      });
      store.document = documentRequest;
      addSuccessAlert(t('published'));
    } catch (error) {
      addErrorAlert(error);
    } finally {
      store.saving = null;
      render();
    }
  }

  async function onlyPublish() {
    await saveAsPublish();
    history.push('/private/leebrary/assignables.content-creator/list?activeTab=published');
  }

  // async function publishAndShare() {
  //   await saveAsPublish();
  //   const { document } = await getDocumentRequest(store.document.assignable);
  //   store.preparedAsset = prepareAsset(document.asset);

  //   store.openShareDrawer = true;
  //   render();
  // }

  async function publishAndAssign() {
    await saveAsPublish();
    history.push(`/private/content-creator/${store.document.assignable}/assign`);
  }

  async function init() {
    try {
      store.loading = true;
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const {
          // eslint-disable-next-line camelcase
          document: { deleted, deleted_at, created_at, updated_at, published, ...document },
        } = await getDocumentRequest(params.id);

        // eslint-disable-next-line react/prop-types
        store.titleValue = document.name;
        document.program = document.subjects?.[0]?.program;
        store.published = published;
        store.document = { ...document };
        form.reset(document);
      }
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  // const savePermissions = async (assetId, { canAccess }) => {
  //   const permissions = await shareDocumentRequest(store.document.assignable, { canAccess });
  //   return permissions;
  // };

  const setTitleIfItsUndefined = (value) => {
    if (store.titleValue) return;
    const parser = new DOMParser();
    const htmlContent = Array.from(
      parser.parseFromString(value, 'text/html').body.getElementsByTagName('*')
    );
    const firstElementWithText = htmlContent.find((element) => element.textContent)?.textContent;
    form.setValue('name', firstElementWithText);
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

  // const handleDrawerClose = () => {
  //   store.openShareDrawer = false;
  //   render();
  // };

  async function goToConfig() {
    store.isConfigPage = true;
    render();
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

  if (store.loading || tLoading) return <LoadingOverlay visible />;

  const advancedConfig = {
    alwaysOpen: true,
    fileToRight: true,
    colorToRight: true,
    program: { show: true, required: false },
    subjects: { show: true, required: true, showLevel: true, maxOne: false },
  };

  return (
    <Box style={{ height: '100vh' }}>
      <Stack direction="column" fullHeight>
        <PageHeader
          placeholders={{ title: t('titlePlaceholder') }}
          values={{
            title: formValues.name,
          }}
          buttons={
            !readOnly && {
              duplicate: t('saveDraft'),
              edit: !store.isConfigPage && t('publish'),
              dropdown: store.isConfigPage && t('publishOptions'),
            }
          }
          buttonsIcons={{
            edit: <SetupContent size={16} />,
          }}
          isEditMode={!store.isConfigPage}
          icon={!store.isConfigPage ? <DocumentIcon /> : null}
          onChange={onTitleChangeHandler}
          onEdit={() => goToConfig()}
          onDuplicate={() => saveAsDraft()}
          onDropdown={[
            { label: t('onlyPublish'), onClick: () => onlyPublish() },
            // { label: t('publishAndShare'), onClick: () => publishAndShare() },
            { label: t('publishAndAssign'), onClick: () => publishAndAssign() },
          ]}
          loading={store.saving}
          fullWidth
        />
        {!store.isConfigPage ? (
          <ContentEditorInput
            useSchema
            schemaLabel={t('schemaLabel')}
            labels={{
              format: t('formatLabel'),
            }}
            onChange={onContentChangeHandler}
            value={formValues.content}
            openLibraryModal={false}
            readOnly={readOnly}
          />
        ) : (
          <PageContent title={t('config')}>
            <Box style={{ padding: '48px 32px' }}>
              <AssetFormInput
                preview
                form={form}
                category="assignables.content-creator"
                previewVariant="document"
                advancedConfig={advancedConfig}
                tagsPluginName="content-creator"
              />
            </Box>
          </PageContent>
        )}
        {/* {store.isConfigPage && (
          <PermissionsDataDrawer
            opened={store.openShareDrawer}
            asset={store.preparedAsset}
            onClose={handleDrawerClose}
            sharing
            size={720}
            onSavePermissions={savePermissions}
          />
        )} */}
      </Stack>
    </Box>
  );
}

Index.propTypes = {
  readOnly: PropTypes.bool,
  isNew: PropTypes.bool,
};
