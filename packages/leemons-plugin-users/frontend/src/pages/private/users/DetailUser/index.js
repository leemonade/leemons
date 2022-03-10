import React from 'react';
import { Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@users/helpers/prefixPN';
import { useHistory, useParams } from 'react-router-dom';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';

function DetailUser() {
  const [t] = useTranslateLoader(prefixPN('detailUser'));
  const [store, render] = useStore({ params: {}, editing: false });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();
  const { userId } = useParams();
  const query = new URLSearchParams(window.location.search);
  store.params.center = query.get('center');
  store.params.profile = query.get('profile');
  store.params.user = userId;

  async function init() {
    try {
      const { data } = await fetch(`/api/users/${userId}`);
      store.user = data;
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
    }
  }

  React.useEffect(() => {
    if (store.params.user) init();
  }, [store.params.user]);

  return <Box>Gaitos</Box>;
}

export default DetailUser;
