import { ContextContainer, PageContainer, Stack } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import React from 'react';
import { SelectCenter } from '../../../../components/SelectCenter';
import { SelectProfile } from '../../../../components/SelectProfile';

function CreateUsers() {
  const [t] = useTranslateLoader(prefixPN('importUsers'));
  const [store, render] = useStore();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  function centerChange(e) {
    store.center = e;
    render();
  }

  function profileChange(e) {
    store.profile = e;
    render();
  }

  async function save() {}

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader values={{ title: t('title') }} />

      <PageContainer noFlex>
        <ContextContainer sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <ContextContainer direction="row">
            <SelectCenter
              label={t('centerLabel')}
              value={store.center}
              disabled={!!store.usersToCreate?.length}
              onChange={centerChange}
            />
            <SelectProfile
              label={t('profileLabel')}
              value={store.profile}
              disabled={!!store.usersToCreate?.length}
              onChange={profileChange}
            />
          </ContextContainer>
        </ContextContainer>
      </PageContainer>
    </Stack>
  );
}

export default CreateUsers;
