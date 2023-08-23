import { Box, Button, Stack } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { forEach, map } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  getDataForUserAgentDatasetsRequest,
  saveDataForUserAgentDatasetsRequest,
} from '../../../request';
import Form from './Form';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserDataDatasetValues() {
  const [t] = useTranslateLoader(prefixPN('userDataDatasetPage'));
  const [store, render] = useStore({ forms: [], formActions: [] });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  async function init() {
    const { data } = await getDataForUserAgentDatasetsRequest();
    store.forms = data;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  function getCallback() {
    const query = new URLSearchParams(window.location.search);
    return query.get('callback');
  }

  async function save() {
    try {
      await saveDataForUserAgentDatasetsRequest(
        map(store.forms, (form) => ({ userAgent: form.userAgent.id, value: form.newValues }))
      );
      addSuccessAlert(t('saveSuccess'));
      const callback = getCallback();
      if (callback) {
        history.push(callback);
      }
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
    }
  }

  async function checkFormsAndSave() {
    let allDone = true;
    const submitPromises = [];
    forEach(store.formActions, (form) => {
      if (form.isLoaded()) {
        submitPromises.push(form.submit());
      } else {
        allDone = false;
      }
    });

    if (allDone) {
      await Promise.all(submitPromises);

      forEach(store.formActions, (form, i) => {
        if (form.getErrors().length) {
          allDone = false;
        } else {
          store.forms[i].newValues = form.getValues();
        }
      });

      if (allDone) {
        await save();
      }
    }
  }

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader values={{ title: t('pageTitle'), description: t('pageDescription') }} />
      {store.forms.map((data, i) => (
        // eslint-disable-next-line no-return-assign
        <Form data={data} formActions={(e) => (store.formActions[i] = e)} key={data.userAgent.id} />
      ))}
      <Box>
        <Button onClick={checkFormsAndSave}>{t('save')}</Button>
      </Box>
    </Stack>
  );
}

export default UserDataDatasetValues;
