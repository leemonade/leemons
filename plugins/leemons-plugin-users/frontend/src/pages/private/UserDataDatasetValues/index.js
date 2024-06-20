import React from 'react';
import { forEach, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Stack, Button, TLayout, ImageLoader } from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import {
  getDataForUserAgentDatasetsRequest,
  saveDataForUserAgentDatasetsRequest,
} from '../../../request';
import Form from './Form';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserDataDatasetValues() {
  const [t] = useTranslateLoader(prefixPN('userDataDatasetPage'));
  const [isLoading, setIsLoading] = React.useState(true);
  const [store, render] = useStore({ forms: [], formActions: [] });
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const history = useHistory();

  async function init() {
    setIsLoading(true);
    const { data } = await getDataForUserAgentDatasetsRequest();
    store.forms = data;
    setIsLoading(false);
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
        map(store.forms, (form) => ({
          userAgent: form.userAgent.id,
          value: form.newValues,
          locationName: form.locationName,
        }))
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
    <TLayout>
      <TLayout.Header
        title={t('pageTitle')}
        cancelable={false}
        icon={
          <Stack justifyContent="center" alignItems="center">
            <ImageLoader
              style={{ position: 'relative' }}
              src="/public/users/menu-icon.svg"
              width={18}
              height={18}
            />
          </Stack>
        }
      ></TLayout.Header>
      <TLayout.Content title={t('additionalInfo')} loading={isLoading}>
        {store.forms.map((data, i) => (
          <Form
            data={data}
            formActions={(e) => {
              store.formActions[i] = e;
            }}
            key={data.userAgent.id}
          />
        ))}
      </TLayout.Content>
      <TLayout.Footer>
        <TLayout.Footer.RightActions>
          <Button onClick={checkFormsAndSave}>{t('save')}</Button>
        </TLayout.Footer.RightActions>
      </TLayout.Footer>
    </TLayout>
  );
}

export default UserDataDatasetValues;
