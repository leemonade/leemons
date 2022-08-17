import React, { useMemo, useState } from 'react';
import {
  Button,
  PageContainer,
  Table,
  Modal,
  Text,
  Box,
  Stack,
  ContextContainer,
  Tabs,
  TabPanel,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { CheckIcon } from '@bubbles-ui/icons/outline';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { getDatasetSchemaRequest, removeDatasetFieldRequest } from '@dataset/request';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import { useHistory } from 'react-router-dom';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useAsync } from '@common/useAsync';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { PackageManagerService } from '@package-manager/services';

import loadable from '@loadable/component';

function dynamicImport(component) {
  return loadable(() =>
    import(
      /* webpackInclude: /(families-emergency-numbers.+)\.js/ */ `@leemons/plugins${component}.js`
    )
  );
}

function DatasetTabs({ t }) {
  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  // const [modal, toggleModal] = useModal({
  //   animated: true,
  //   title: t('remove_modal.title'),
  //   message: t('remove_modal.message'),
  //   cancelLabel: t('remove_modal.cancel'),
  //   actionLabel: t('remove_modal.action'),
  //   onAction: async () => {
  //     try {
  //       await removeDatasetFieldRequest(`families-data`, 'plugins.families', itemToRemove.id);
  //       addSuccessAlert(t('dataset_tab.deleted_done'));
  //       await reload();
  //     } catch (e) {
  //       addErrorAlert(getErrorMessage(e));
  //     }
  //   },
  // });

  function newItem() {
    setItem(null);
    toggle();
  }

  function openItem(item) {
    setItem(item);
    toggle();
  }

  function removeItem(item) {
    setItemToRemove(item);
    // toggleModal();
  }

  async function reload() {
    try {
      setLoading(true);
      await onSuccess(await load());
    } catch (e) {
      onError(e);
    }
  }

  async function onSave() {
    await reload();
  }

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('dataset_tab.table.name'),
        accessor: (field) => (
          <Text className="text-left">
            {field.schema.frontConfig.name} {field.schema.frontConfig.required ? '*' : ''}
          </Text>
        ),
        className: 'text-left',
      },
      {
        Header: t('dataset_tab.table.description'),
        accessor: 'description',
        className: 'text-left',
      },
      {
        Header: t('dataset_tab.table.type'),
        accessor: (field) => (
          <Text className="text-center">{tCommonTypes(field.schema.frontConfig.type)}</Text>
        ),
        className: 'text-center',
      },
      {
        Header: t('dataset_tab.table.actions'),
        accessor: (field) => (
          <Box>
            <Button color="primary" text onClick={() => openItem(field)}>
              {t('dataset_tab.table.edit')}
            </Button>
            <Button color="primary" text onClick={() => removeItem(field)}>
              {t('dataset_tab.table.delete')}
            </Button>
          </Box>
        ),
        className: 'text-center',
      },
    ],
    [t, tCommonTypes]
  );

  const load = useMemo(
    () => () => getDatasetSchemaRequest(`families-data`, 'plugins.families'),
    []
  );

  const onSuccess = useMemo(
    () =>
      ({ dataset }) => {
        setTableItems(getDatasetAsArrayOfProperties(dataset));
        setLoading(false);
      },
    []
  );

  const onError = useMemo(
    () => (e) => {
      // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
      if (e.code !== 4001) {
        setError(e);
      }
      setLoading(false);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  return (
    <>
      {/* <Modal {...modal} /> */}
      <Box>
        <PageContainer className="pt-0">
          <ErrorAlert />
          {!loading && !error ? (
            <Stack justifyContent="flex-end" alignItems="center">
              <Button color="secondary" onClick={newItem}>
                {/* <PlusIcon className="w-6 h-6 mr-1" /> */}
                {t('dataset_tab.add_field')}
              </Button>

              <DatasetItemDrawer
                locationName={`families-data`}
                pluginName="plugins.families"
                item={item}
                onSave={onSave}
              />
            </Stack>
          ) : null}
        </PageContainer>
      </Box>
      {!loading && !error && (
        <Box>
          {tableItems && tableItems.length ? (
            <Table columns={tableHeaders} data={tableItems} />
          ) : (
            <Text>{t('dataset_tab.no_data_in_table')}</Text>
          )}
        </Box>
      )}
    </>
  );
}

function Config() {
  const history = useHistory();
  const [installingEmergencyNumber, setInstallingEmergencyNumber] = useState(false);
  const [emergencyNumberInstalled, setEmergencyNumberInstalled] = useState(false);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const [opened, setOpened] = useState(false);
  const [t] = useTranslateLoader(prefixPN('config_page'));

  const load = useMemo(
    () => () =>
      PackageManagerService.isPluginInstalled('leemons-plugin-families-emergency-numbers'),
    []
  );

  const onSuccess = useMemo(
    () => (installed) => {
      setEmergencyNumberInstalled(installed);
    },
    []
  );

  const onError = useMemo(() => () => {}, []);

  useAsync(load, onSuccess, onError);

  const openInstallPhoneModal = async () => {
    setOpened(!opened);
  };

  const installPhoneAddon = async () => {
    try {
      setInstallingEmergencyNumber(true);
      await PackageManagerService.installPluginByNPM(
        'leemons-plugin-families-emergency-numbers',
        '1.0.0'
      );
      setTimeout(() => {
        setEmergencyNumberInstalled(true);
      }, 4000);
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      setInstallingEmergencyNumber(false);
    }
  };

  let EmergencyNumbersTabs = null;
  if (emergencyNumberInstalled && !installingEmergencyNumber) {
    EmergencyNumbersTabs = dynamicImport('/families-emergency-numbers/src/components/config');
  }

  return (
    <>
      <Modal opened={opened} title={t} onClose={() => setOpened(false)}>
        {installingEmergencyNumber ? (
          <Stack>
            <Button color="primary" className="btn-xl" loading={!emergencyNumberInstalled} text>
              {emergencyNumberInstalled && <CheckIcon />}
              <Text className="text-secondary">
                {emergencyNumberInstalled
                  ? t('phone_modal.installed')
                  : t('phone_modal.installing')}
              </Text>
            </Button>
          </Stack>
        ) : (
          <Stack direction="column" spacing={4}>
            <Box>
              <Text>{t('phone_modal.message1')}</Text>
            </Box>
            <Stack spacing={4}>
              <Button
                color="tertiary"
                onClick={() => {
                  setOpened(false);
                }}
              >
                {t('phone_modal.cancel')}
              </Button>
              <Button onClick={installPhoneAddon}>{t('phone_modal.action')}</Button>
            </Stack>
          </Stack>
        )}
      </Modal>
      <AdminPageHeader values={{ title: t('title'), description: t('description1') }} />
      <PageContainer>
        {!emergencyNumberInstalled && (
          <ContextContainer>
            <Text>{t('phone_description')}</Text>
            <Box>
              <Button color="primary" className="mt-4" onClick={openInstallPhoneModal}>
                {t('phone_button')}
              </Button>
            </Box>
          </ContextContainer>
        )}
        <Tabs>
          <TabPanel label={t('tabs.basic')}>a</TabPanel>
          <TabPanel label={t('tabs.dataset')}>
            <DatasetTabs t={t} />
          </TabPanel>
          {emergencyNumberInstalled && (
            <TabPanel label={t('tabs.emergency_numbers')}>
              <EmergencyNumbersTabs />
            </TabPanel>
          )}
          <TabPanel label={t('tabs.permissions')}>c</TabPanel>
        </Tabs>
      </PageContainer>
    </>
  );
}

export default Config;
