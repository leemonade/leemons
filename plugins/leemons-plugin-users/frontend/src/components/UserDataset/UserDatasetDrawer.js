import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Drawer, Stack, Button } from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getSessionUserAgent } from '@users/session';
import { UserDatasets } from './UserDatasets';

function UserDatasetDrawer({ isOpen, onClose = noop }) {
  const [t] = useTranslateLoader(prefixPN('userDataDatasetPage'));
  const [saving, setSaving] = React.useState(false);
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const userAgentId = getSessionUserAgent();
  const userDatasetsRef = React.useRef(null);

  // ····················································
  // METHODS

  async function handleSave() {
    setSaving(true);
    try {
      const userDatasets = userDatasetsRef.current;
      const success = await userDatasets.checkFormsAndSave();
      if (success) {
        addSuccessAlert(t('saveSuccess'));
        onClose();
      }
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  // ····················································
  // RENDER

  return (
    <Drawer size="sm" opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('additionalInfo')} />
      <Drawer.Content>
        <UserDatasets
          ref={userDatasetsRef}
          userAgentIds={[userAgentId]}
          showTitle={false}
          preferEditMode
        />
      </Drawer.Content>
      <Drawer.Footer>
        <Stack fullWidth justifyContent="space-between">
          <Button type="button" variant="link" compact onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {t('save')}
          </Button>
        </Stack>
      </Drawer.Footer>
    </Drawer>
  );
}

UserDatasetDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export { UserDatasetDrawer };
