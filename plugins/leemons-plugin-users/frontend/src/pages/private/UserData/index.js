import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { Stack, TabPanel, Tabs } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { SystemData } from './SystemData';
import { CommonFields } from './CommonFields';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserData() {
  const [t] = useTranslateLoader(prefixPN('user_data_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader values={{ title: t('page_title'), description: t('page_description') }} />

      <Tabs usePageLayout={true} panelColor="solid" fullHeight>
        <TabPanel label={t('tabs.system_data')}>
          <SystemData t={t} getErrorMessage={getErrorMessage} />
        </TabPanel>
        <TabPanel label={t('tabs.common_fields')}>
          <CommonFields t={t} getErrorMessage={getErrorMessage} />
        </TabPanel>
      </Tabs>
    </Stack>
  );
}

export default UserData;
