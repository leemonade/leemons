import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Button,
  TLayout,
  ImageLoader,
  ContextContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { UploadFile } from './components/uploadFile';

import { SelectCenter } from '@users/components/SelectCenter';
import { SelectProfile } from '@users/components/SelectProfile';
import prefixPN from '@users/helpers/prefixPN';

function ImportUsers() {
  const [t] = useTranslateLoader(prefixPN('importUsers'));
  const [tList] = useTranslateLoader(prefixPN('list_users'));
  const [store, render] = useStore();
  const scrollRef = React.useRef();
  const history = useHistory();

  function centerChange(e) {
    store.center = e;
    render();
  }

  function profileChange(e) {
    store.profile = e;
    render();
  }

  function goToUsersList() {
    history.push('/private/users/list');
  }

  const childrens = React.useMemo(() => {
    const result = [
      <ContextContainer key="1" direction="row" sx={{ maxWidth: 500 }}>
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
    } else {
      result.push(
        <TotalLayoutFooterContainer
          fixed
          fullWidth
          leftZone={
            <Button variant="link" onClick={goToUsersList} leftIcon={<ChevLeftIcon />}>
              {t('backToUsers')}
            </Button>
          }
        />
      );
    }
    return result;
  }, [store.center, store.profile]);

  return (
    <TLayout scrollRef={scrollRef}>
      <TLayout.Header
        title={tList('pageTitle')}
        cancelable={false}
        icon={
          <Box sx={{ position: 'relative', width: 24, height: 24 }}>
            <ImageLoader src="/public/users/menu-icon.svg" width={18} height={18} />
          </Box>
        }
      />
      <TLayout.Content fullWidth>
        <Box>
          <ContextContainer title={t('title')}>{childrens}</ContextContainer>
        </Box>
      </TLayout.Content>
    </TLayout>
  );
}

export default ImportUsers;
