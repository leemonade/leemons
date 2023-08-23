import React from 'react';
import { Box, PageHeader, Tabs, TabPanel, createStyles } from '@bubbles-ui/components';
import { useStore } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@board-messages/helpers/prefixPN';
import useTranslateObjectLoader from '@multilanguage/useTranslateObjectLoader';
import { DetailDrawer, MessagesTable } from '@board-messages/components';

// eslint-disable-next-line no-unused-vars, no-empty-pattern
const IndexStyles = createStyles(() => ({ panelList: { backgroundColor: 'white' } }));

export default function Index() {
  const labels = useTranslateObjectLoader(prefixPN('list'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [store, render] = useStore({
    isDrawerOpen: false,
    isNew: true,
    currentMessage: {},
    centers: [],
    profiles: [],
    reloadMessages: {},
  });

  const toggleDetailDrawer = () => {
    store.isNew = true;
    store.isDrawerOpen = !store.isDrawerOpen;
    store.currentMessage = {};
    render();
  };

  const openEditDrawer = (message) => {
    store.isNew = false;
    store.isDrawerOpen = true;
    store.currentMessage = {
      ...message,
      startDate: new Date(message.startDate),
      endDate: new Date(message.endDate),
    };
    render();
  };

  const setCenters = (centers) => {
    store.centers = centers;
    render();
  };

  const setProfiles = (profiles) => {
    store.profiles = profiles;
    render();
  };

  const reloadMessages = () => {
    store.reloadMessages = {};
    render();
  };

  const { classes } = IndexStyles({});

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        values={{ title: labels.pageTitle, description: labels.pageDescription }}
        buttons={{ new: tCommon('new') }}
        onNew={toggleDetailDrawer}
        fullWidth
      ></PageHeader>
      <Tabs
        panelColor="solid"
        usePageLayout
        fullWidth
        fullHeight
        classNames={{ panelList: classes.panelList }}
        onChange={() => {
          reloadMessages();
        }}
      >
        <TabPanel label={labels.created}>
          <MessagesTable
            labels={labels}
            shouldReload={store.reloadMessages}
            openEditDrawer={openEditDrawer}
            centers={store.centers}
            setCenters={setCenters}
            profiles={store.profiles}
            setProfiles={setProfiles}
          />
        </TabPanel>
        <TabPanel label={labels.archived}>
          <MessagesTable
            labels={labels}
            shouldReload={store.reloadMessages}
            openEditDrawer={openEditDrawer}
            centers={store.centers}
            setCenters={setCenters}
            profiles={store.profiles}
            setProfiles={setProfiles}
            onlyArchived
          />
        </TabPanel>
      </Tabs>
      <DetailDrawer
        labels={labels.drawer}
        isNew={store.isNew}
        currentMessage={store.currentMessage}
        open={store.isDrawerOpen}
        onClose={toggleDetailDrawer}
        centers={store.centers}
        profiles={store.profiles}
        reloadMessages={reloadMessages}
      />
    </Box>
  );
}
