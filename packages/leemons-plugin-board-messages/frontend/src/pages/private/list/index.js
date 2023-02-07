import React from 'react';
import { Box, LoadingOverlay } from '@bubbles-ui/components';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@fundae/helpers/prefixPN';
import { addErrorAlert } from '@layout/alert';

export default function Index() {
  const [t] = useTranslateLoader(prefixPN('list'));
  const [store, render] = useStore({
    loading: true,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  async function init() {
    try {
      store.loading = true;
      render();

      // consulta

      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    init();
  }, []);

  if (store.loading) return <LoadingOverlay visible />;

  return <Box>Miau</Box>;
}
