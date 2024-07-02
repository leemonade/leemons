import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, noop } from 'lodash';
import { Drawer, Stack, Button } from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import {
  getDataForUserAgentDatasetsRequest,
  saveDataForUserAgentDatasetsRequest,
} from '@users/request';
import Form from './Form';

function getReadOnlyKeys(jsonUI) {
  return Object.keys(jsonUI).filter((key) => jsonUI[key]['ui:readonly']);
}

function areOptionalKeys({ errors, jsonUI }) {
  const readOnlyKeys = getReadOnlyKeys(jsonUI);
  // check if all the error.property are readOnlyKey
  const errorProperties = errors.map((error) => error.property);
  return errorProperties.every((property) => readOnlyKeys.includes(property));
}

function UserDataDatasetDrawer({ isOpen, onClose = noop }) {
  const [t] = useTranslateLoader(prefixPN('userDataDatasetPage'));
  const [isLoading, setIsLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [forms, setForms] = React.useState([]);
  const formActions = React.useRef([]);
  const [, , , getErrorMessage] = useRequestErrorMessage();

  // ····················································
  // INITIAL DATA HANDLING

  async function init() {
    setIsLoading(true);
    const { data } = await getDataForUserAgentDatasetsRequest();
    setForms(data);
    setIsLoading(false);
  }

  React.useEffect(() => {
    init();
  }, []);

  // ····················································
  // METHODS

  async function save() {
    setSaving(true);
    try {
      await saveDataForUserAgentDatasetsRequest(
        map(forms, (form) => ({
          userAgent: form.userAgent.id,
          value: form.newValues,
          locationName: form.locationName,
        }))
      );
      addSuccessAlert(t('saveSuccess'));
      onClose();
      init();
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function checkFormsAndSave() {
    let allDone = true;
    const submitPromises = [];

    forEach(formActions.current, (form) => {
      if (form.isLoaded()) {
        submitPromises.push(form.submit());
      } else {
        allDone = false;
      }
    });

    if (allDone) {
      await Promise.all(submitPromises);
      const newForms = [...forms];

      forEach(formActions.current, (form, i) => {
        const errors = form.getErrors();
        const areOptional = areOptionalKeys({ errors, jsonUI: newForms[i].data.jsonUI });
        if (errors.length && !areOptional) {
          allDone = false;
        } else {
          newForms[i].newValues = form.getValues();
        }
      });

      if (allDone) {
        setForms(newForms);
        await save();
      }
    }
  }

  // ····················································
  // RENDER

  return (
    <Drawer size="sm" opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('additionalInfo')} />
      <Drawer.Content loading={isLoading}>
        {forms.map((data, i) => (
          <Form
            hideReadOnly
            key={data.locationName}
            data={data}
            formActions={(e) => {
              formActions.current[i] = e;
            }}
          />
        ))}
      </Drawer.Content>
      <Drawer.Footer>
        <Stack fullWidth justifyContent="space-between">
          <Button type="button" variant="link" compact onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={checkFormsAndSave} loading={saving}>
            {t('save')}
          </Button>
        </Stack>
      </Drawer.Footer>
    </Drawer>
  );
}

UserDataDatasetDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export { UserDataDatasetDrawer };
