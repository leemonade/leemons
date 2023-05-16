import React from 'react';
import { Box, PageHeader, LoadingOverlay, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { DocumentIcon } from '@content-creator/components/icons';
import prefixPN from '@content-creator/helpers/prefixPN';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { useParams } from 'react-router-dom';
import { getDocumentRequest } from '@content-creator/request';

export default function Index() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS

  const [store, render] = useStore({
    loading: true,
    isNew: false,
    titleValue: '',
    document: {},
    preparedAsset: {},
    isConfigPage: false,
    openShareDrawer: false,
  });

  const params = useParams();

  async function init() {
    try {
      store.loading = true;
      render();
      store.instance = await getAssignableInstance({ id: params.id });
      const { document } = await getDocumentRequest(store.instance.assignable.id);
      store.document = document;
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

  if (store.loading || tLoading) return <LoadingOverlay visible />;

  return (
    <Box style={{ height: '100vh' }}>
      <Stack direction="column" fullHeight>
        <PageHeader
          values={{
            title: store.document.name,
          }}
          icon={!store.isConfigPage ? <DocumentIcon /> : null}
          loading={store.saving}
          fullWidth
        />
        <ContentEditorInput
          useSchema
          schemaLabel={t('schemaLabel')}
          labels={{
            format: t('formatLabel'),
          }}
          value={store.document.content}
          openLibraryModal={false}
          readOnly
        />
      </Stack>
    </Box>
  );
}
