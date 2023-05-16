import React, { useContext } from 'react';
import { Box, Button, createStyles, DrawerPush, Paragraph, Text } from '@bubbles-ui/components';
import { AddCircleIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { LayoutContext } from '@layout/context/layout';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@academic-calendar/helpers/prefixPN';
import { useStore } from '@common';
import { SelectCenter } from '@users/components/SelectCenter';
import { listRegionalConfigsRequest } from '@academic-calendar/request';
import { RegionalConfigDetail } from './components/regionalConfigDetail';

const useStyle = createStyles((theme) => ({
  container: {
    display: 'flex',
  },
  content: {
    width: 'calc(100% - 320px)',
    boxSizing: 'border-box',
  },
  drawer: {
    height: '100vh',
    padding: theme.spacing[7],
    paddingLeft: theme.spacing[10],
    borderRight: `1px solid ${theme.colors.ui01}`,
    marginBottom: theme.spacing[7],
  },
  drawerTitle: {
    marginBottom: theme.spacing[7],
    '*': {
      color: theme.colors.text04,
      fontSize: `${theme.fontSizes[3]}px!important`,
    },
  },
  titleTop: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  drawerText: {
    marginBottom: theme.spacing[10],
  },

  formTitle: {
    display: 'block',
    marginBottom: theme.spacing[5],
  },
  form: {
    paddingBottom: theme.spacing[7] * 2,
  },
  configItem: {
    padding: `${theme.spacing[3]}px ${theme.spacing[4]}px`,
    fontWeight: 500,
    verticalAlign: 'middle',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.interactive01v1,
      color: theme.colors.interactive01,
    },
  },
  configItemActive: {
    backgroundColor: theme.colors.interactive01v1,
    color: theme.colors.interactive01,
  },
  configItemName: {
    paddingLeft: theme.spacing[2],
    display: 'inline',
  },
}));

export default function RegionalCalendars() {
  const [t, , , loading] = useTranslateLoader(prefixPN('regionalList'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { classes, cx } = useStyle();

  const { setLoading, scrollTo } = useContext(LayoutContext);
  const [store, render] = useStore({
    center: null,
  });

  async function loadRegionalConfigs() {
    const { regionalConfigs } = await listRegionalConfigsRequest(store.center);
    store.regionalConfigs = regionalConfigs;
    render();
  }

  function handleOnSelectCenter(center) {
    store.center = center;
    loadRegionalConfigs();
  }

  function addNewRegionalCalendar() {
    store.selectedConfig = {};
    render();
  }

  return (
    <Box className={classes.container}>
      <DrawerPush opened={true} size={320} fixed={true}>
        <Box className={classes.drawer}>
          <Box className={classes.drawerTitle}>
            <Box className={classes.titleTop}>
              <PluginCalendarIcon width={18} height={18} />
              <Text size="lg">{t('title')}</Text>
            </Box>
          </Box>
          <Paragraph
            className={classes.drawerText}
            dangerouslySetInnerHTML={{ __html: t('description') }}
          />
          <Box className={classes.form}>
            <Box>
              <SelectCenter
                label={t('selectCenter')}
                onChange={handleOnSelectCenter}
                firstSelected
              />
            </Box>

            {store.center ? (
              <Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>
                  {store.regionalConfigs
                    ? store.regionalConfigs.map((config) => (
                        <Box
                          key={config.id}
                          className={cx(
                            classes.configItem,
                            config.id === store.selectedConfig?.id && classes.configItemActive
                          )}
                          onClick={() => {
                            store.selectedConfig = config;
                            render();
                          }}
                        >
                          <PluginCalendarIcon width={16} height={16} />
                          <Box className={classes.configItemName}>{config.name}</Box>
                        </Box>
                      ))
                    : null}
                </Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>
                  <Button
                    onClick={addNewRegionalCalendar}
                    leftIcon={<AddCircleIcon />}
                    variant="link"
                  >
                    {t('addRegionalCalendar')}
                  </Button>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
      </DrawerPush>
      <Box className={classes.content}>
        {store.selectedConfig ? (
          <RegionalConfigDetail
            t={t}
            center={store.center}
            config={store.selectedConfig}
            calendars={store.regionalConfigs}
            onSave={() => {
              store.selectedConfig = null;
              loadRegionalConfigs();
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
}
