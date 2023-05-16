import { ContextContainer, PageContainer, Stack } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import React from 'react';
import { SelectCenter } from '../../../../components/SelectCenter';
import { SelectProfile } from '../../../../components/SelectProfile';
import UploadFile from './components/uploadFile';

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

  const childrens = React.useMemo(() => {
    const result = [
      <ContextContainer key="1" direction="row">
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
      </ContextContainer>,
    ];
    if (store.center && store.profile) {
      result.push(<UploadFile t={t} center={store.center} profile={store.profile} />);
    }
    return result;
  }, [store.center, store.profile]);

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader values={{ title: t('title'), description: t('description') }} />

      <PageContainer noFlex>
        <ContextContainer divided sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          {childrens}
        </ContextContainer>
      </PageContainer>
    </Stack>
  );
}

export default CreateUsers;
