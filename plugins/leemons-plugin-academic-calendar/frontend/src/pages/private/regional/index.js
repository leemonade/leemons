import prefixPN from '@academic-calendar/helpers/prefixPN';
import { listRegionalConfigsRequest } from '@academic-calendar/request';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  PageContainer,
  Drawer,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
  TotalLayoutHeader,
  Stack,
  Table,
  ActionButton,
} from '@bubbles-ui/components';
import { DeleteBinIcon, EditIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useStore } from '@common';
import { saveRegionalConfig } from '@academic-calendar/request/regional-config';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import React, { useEffect, useMemo, useState } from 'react';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import { useForm } from 'react-hook-form';
import { getCentersWithToken } from '@users/session';
import { EmptyState } from './components/EmptyState';
import { RegionalConfigDetail } from './components/regionalConfigDetail';

const useStyle = createStyles((theme) => ({
  container: {
    display: 'flex',
  },
  content: {
    width: 'calc(100% - 320px)',
    boxSizing: 'border-box',
  },
  pageContainer: {
    paddingLeft: 0,
    paddingRight: 0,
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
  actionButtonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function RegionalCalendars() {
  const [t] = useTranslateLoader(prefixPN('regionalList'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const scrollRef = React.useRef(null);
  const { classes, cx } = useStyle();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userCenters, setUserCenters] = useState();
  const [selectedCenter, setSelectedCenter] = useState();
  const deploymentConfig = useDeploymentConfig({
    pluginName: 'academic-calendar',
    ignoreVersion: true,
  });
  const [store, render] = useStore({
    center: null,
    scroll: 0,
  });

  async function loadRegionalConfigs() {
    const { regionalConfigs } = await listRegionalConfigsRequest(store?.center?.id);
    store.regionalConfigs = regionalConfigs;
    render();
  }

  function handleOnSelectCenter(center) {
    setSelectedCenter(center);
    store.center = center;
    loadRegionalConfigs();
  }

  function addNewRegionalCalendar() {
    store.selectedConfig = {};
    setIsDrawerOpen(true);
    render();
  }

  useEffect(() => {
    const centers = getCentersWithToken();
    setUserCenters(centers);
    handleOnSelectCenter(centers[0]);
  }, []);

  const form = useForm();

  function save() {
    form.handleSubmit(async (data) => {
      try {
        store.saving = true;
        render();

        await saveRegionalConfig({
          ...data,
          center: store.center.id,
        });

        addSuccessAlert(t('saved'));
        store.selectedConfig = null;
        loadRegionalConfigs();
        setIsDrawerOpen(false);
      } catch (err) {
        addErrorAlert(getErrorMessage(err));
      }
      store.saving = false;
      render();
    })();
  }

  const colums = useMemo(
    () => [
      {
        Header: '',
        accessor: 'name',
      },
      {
        Header: '',
        accessor: 'actions',
        cellStyle: { justifyContent: 'end' },
      },
    ],
    []
  );

  const data = useMemo(
    () =>
      store.regionalConfigs?.map((config) => ({
        ...config,
        actions: (
          <Stack justifyContent="end" alignItems="center">
            <Box>
              <ActionButton
                icon={<EditIcon />}
                onClick={() => {
                  store.selectedConfig = config;
                  setIsDrawerOpen(true);
                  render();
                }}
              />
            </Box>
            <Box>
              <ActionButton
                // disabled={grade.inUse}
                icon={<DeleteBinIcon />}
                onClick={() => console.log('delete!')}
              />
            </Box>
          </Stack>
        ),
      })),
    [store.regionalConfigs]
  );

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={t('title')}
          icon={<PluginCalendarIcon width={24} height={24} />}
          scrollRef={scrollRef}
          cancelable={false}
        >
          <SelectCenter
            firstSelected
            onChange={(v) => handleOnSelectCenter(userCenters?.find((c) => c.id === v))}
            value={selectedCenter?.id}
          />
        </TotalLayoutHeader>
      }
    >
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto' }}
        fullWidth
        fullHeight
      >
        <TotalLayoutStepContainer stepName={selectedCenter?.name}>
          <ContextContainer
            sx={(theme) => ({
              paddingBottom: theme.spacing[12],
              overflow: 'auto',
            })}
            fullHeight
            fullWidth
          >
            <PageContainer noFlex fullWidth className={classes.pageContainer}>
              <Box>
                <ContextContainer divided>
                  {store.center ? (
                    <Box>
                      {!(deploymentConfig?.deny?.others?.indexOf('addRegionalCalendar') >= 0) ? (
                        <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>
                          <Button
                            onClick={addNewRegionalCalendar}
                            leftIcon={<AddCircleIcon />}
                            variant="link"
                          >
                            {t('addRegionalCalendar')}
                          </Button>
                        </Box>
                      ) : null}
                      <Box sx={(theme) => ({ marginTop: theme.spacing[3], width: '50%' })}>
                        <Table columns={colums} data={data} />
                        {store.regionalConfigs?.length <= 0 ? (
                          <EmptyState onSelectAsset={addNewRegionalCalendar} t={t} />
                        ) : null}
                      </Box>
                    </Box>
                  ) : null}
                </ContextContainer>
              </Box>
              {/* CONTENT ----------------------------------------- */}
              <Drawer size="xl" opened={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Drawer.Header
                  title={!store.selectedConfig?.id ? t('newRegionalCalendar') : t('edit')}
                />
                <Drawer.Content>
                  {store.selectedConfig ? (
                    <RegionalConfigDetail
                      t={t}
                      center={store.center}
                      config={store.selectedConfig}
                      calendars={store.regionalConfigs}
                      form={form}
                      onSave={() => {}}
                    />
                  ) : null}
                </Drawer.Content>
                <Drawer.Footer>
                  <Box className={classes.actionButtonsContainer}>
                    <Button
                      type="button"
                      variant="link"
                      compact
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button onClick={save} loading={store.saving}>
                      {t('save')}
                    </Button>
                  </Box>
                </Drawer.Footer>
              </Drawer>
            </PageContainer>
          </ContextContainer>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
