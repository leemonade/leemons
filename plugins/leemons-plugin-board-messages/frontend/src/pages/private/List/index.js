import React from 'react';
import {
  Box,
  Stack,
  Tabs,
  TabPanel,
  ImageLoader,
  createStyles,
  TotalLayoutHeader,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { getCookieToken } from '@users/session';
import prefixPN from '@board-messages/helpers/prefixPN';
import useTranslateObjectLoader from '@multilanguage/useTranslateObjectLoader';
import { DetailDrawer, MessagesTable } from '@board-messages/components';
import { useProfiles } from '@users/hooks';

const PageStyles = createStyles(() => ({ panelList: { backgroundColor: 'white' } }));

export default function Index() {
  const labels = useTranslateObjectLoader(prefixPN('list'));
  const scrollRef = React.useRef();
  const sessionToken = getCookieToken(true);
  const { data: profiles } = useProfiles();

  const profileItemsWithoutAdmin = React.useMemo(
    () =>
      profiles
        ?.filter((profile) => profile.sysName !== 'admin')
        ?.map((profile) => ({ label: profile.name, value: profile.id })) ?? [],
    [profiles]
  );

  const [store, render] = useStore({
    isDrawerOpen: false,
    isNew: true,
    currentMessage: {},
    centers: [],
    profiles: [],
    reloadMessages: {},
  });

  // ····················································
  // HANDLERS

  const toggleDetailDrawer = () => {
    store.isNew = true;
    store.isDrawerOpen = !store.isDrawerOpen;
    store.currentMessage = {};
    render();
  };

  const handleOnNew = () => {
    store.isNew = true;
    store.isDrawerOpen = true;
    store.currentMessage = {};
    render();
  };

  const handleOnEdit = (message) => {
    store.isNew = false;
    store.isDrawerOpen = true;
    store.currentMessage = {
      ...message,
      startDate: new Date(message.startDate),
      endDate: new Date(message.endDate),
    };
    render();
  };

  // ····················································
  // HELPERS

  const setCenters = (centers) => {
    store.centers = centers;
    render();
  };

  const reloadMessages = () => {
    store.reloadMessages = {};
    render();
  };

  // ····················································
  // RENDER

  const centerName = React.useMemo(() => {
    const center = sessionToken?.centers?.[0];
    return center?.name ?? '';
  }, [sessionToken]);

  const { classes } = PageStyles({}, { name: 'BoardMessagesList' });

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={labels.pageTitle}
          cancelable={false}
          icon={
            <Box sx={{ position: 'relative', width: 24, height: 24 }}>
              <ImageLoader src="/public/board-messages/menu-icon.svg" width={18} height={18} />
            </Box>
          }
        />
      }
    >
      <Stack
        ref={scrollRef}
        justifyContent="center"
        fullWidth
        sx={(theme) => ({ overflowY: 'auto', marginTop: theme.other.global.spacing.padding.lg })}
      >
        <TotalLayoutStepContainer clean fullWidth stepName={centerName} footerPadding={0}>
          <Tabs
            panelColor="solid"
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
                onEdit={handleOnEdit}
                onNew={handleOnNew}
                centers={store.centers}
                setCenters={setCenters}
                profiles={profileItemsWithoutAdmin}
              />
            </TabPanel>
            <TabPanel label={labels.archived}>
              <MessagesTable
                labels={labels}
                shouldReload={store.reloadMessages}
                onEdit={handleOnEdit}
                centers={store.centers}
                setCenters={setCenters}
                profiles={profileItemsWithoutAdmin}
                onlyArchived
              />
            </TabPanel>
          </Tabs>
        </TotalLayoutStepContainer>
      </Stack>
      <DetailDrawer
        labels={labels.drawer}
        isNew={store.isNew}
        currentMessage={store.currentMessage}
        open={store.isDrawerOpen}
        onClose={toggleDetailDrawer}
        centers={store.centers}
        profiles={profileItemsWithoutAdmin}
        reloadMessages={reloadMessages}
      />
    </TotalLayoutContainer>
  );
}
