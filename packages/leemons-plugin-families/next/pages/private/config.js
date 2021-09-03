import { useMemo, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import {
  Button,
  Modal,
  PageContainer,
  PageHeader,
  Tab,
  Table,
  TabList,
  TabPanel,
  Tabs,
  useModal,
} from 'leemons-ui';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { getDatasetSchemaRequest, removeDatasetFieldRequest } from '@dataset/request';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import { useRouter } from 'next/router';
import { CheckIcon, PlusIcon } from '@heroicons/react/outline';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useAsync } from '@common/useAsync';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { PackageManagerService } from '@package-manager/services';
import { dynamicImport } from '@common/dynamicImport';

function DatasetTabs({ t }) {
  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('remove_modal.title'),
    message: t('remove_modal.message'),
    cancelLabel: t('remove_modal.cancel'),
    actionLabel: t('remove_modal.action'),
    onAction: async () => {
      try {
        await removeDatasetFieldRequest(`families-data`, 'plugins.families', itemToRemove.id);
        addSuccessAlert(t('dataset_tab.deleted_done'));
        await reload();
      } catch (e) {
        addErrorAlert(getErrorMessage(e));
      }
    },
  });

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
    toggleModal();
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
          <div className="text-left">
            {field.schema.frontConfig.name} {field.schema.frontConfig.required ? '*' : ''}
          </div>
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
          <div className="text-center">{tCommonTypes(field.schema.frontConfig.type)}</div>
        ),
        className: 'text-center',
      },
      {
        Header: t('dataset_tab.table.actions'),
        accessor: (field) => (
          <div className="text-center">
            <Button color="primary" text onClick={() => openItem(field)}>
              {t('dataset_tab.table.edit')}
            </Button>
            <Button color="primary" text onClick={() => removeItem(field)}>
              {t('dataset_tab.table.delete')}
            </Button>
          </div>
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
    () => ({ dataset }) => {
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
      <Modal {...modal} />
      <div className="bg-primary-content">
        <PageContainer className="pt-0">
          <ErrorAlert />
          {!loading && !error ? (
            <div className="pt-6 mb-6 flex flex-row justify-end items-center">
              <Button color="secondary" onClick={newItem}>
                <PlusIcon className="w-6 h-6 mr-1" />
                {t('dataset_tab.add_field')}
              </Button>

              <DatasetItemDrawer
                locationName={`families-data`}
                pluginName="plugins.families"
                item={item}
                onSave={onSave}
              />
            </div>
          ) : null}
        </PageContainer>
      </div>
      {!loading && !error ? (
        <PageContainer>
          <div className="bg-primary-content p-4">
            <div>
              {tableItems && tableItems.length ? (
                <Table columns={tableHeaders} data={tableItems} />
              ) : (
                <div className="text-center">{t('dataset_tab.no_data_in_table')}</div>
              )}
            </div>
          </div>
        </PageContainer>
      ) : null}
    </>
  );
}

function Config() {
  useSession({ redirectTo: goLoginPage });
  const router = useRouter();
  const [installingEmergencyNumber, setInstallingEmergencyNumber] = useState(false);
  const [emergencyNumberInstalled, setEmergencyNumberInstalled] = useState(false);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const [t] = useTranslateLoader(prefixPN('config_page'));

  const [modal, toggleModal] = useModal({
    animated: true,
    title: installingEmergencyNumber ? null : t('phone_modal.title'),
    closeButton: !installingEmergencyNumber,
    overlayClose: !installingEmergencyNumber,
  });

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

  const onError = useMemo(() => (e) => {}, []);

  useAsync(load, onSuccess, onError);

  const openInstallPhoneModal = async () => {
    toggleModal();
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
    EmergencyNumbersTabs = dynamicImport('families-emergency-numbers/components/config');
  }

  return (
    <>
      <Modal {...modal}>
        {installingEmergencyNumber ? (
          <div className="text-center pt-4">
            <Button color="primary" className="btn-xl" loading={!emergencyNumberInstalled} text>
              {emergencyNumberInstalled ? <CheckIcon className="w-7 h-7 mr-2" /> : null}
              <span className="text-secondary">
                {emergencyNumberInstalled
                  ? t('phone_modal.installed')
                  : t('phone_modal.installing')}
              </span>
            </Button>
          </div>
        ) : (
          <>
            <div className="text-sm text-secondary mb-6">{t('phone_modal.message1')}</div>
            <div className="mt-6 flex flex-row gap-2 justify-end">
              <Button color="ghost" onClick={toggleModal}>
                {t('phone_modal.cancel')}
              </Button>
              <Button color="primary" onClick={installPhoneAddon}>
                {t('phone_modal.action')}
              </Button>
            </div>
          </>
        )}
      </Modal>
      <PageHeader title={t('title')} />
      <div className="bg-primary-content">
        <PageContainer>
          <div className="page-description max-w-screen-sm">{t('description1')}</div>
          {!emergencyNumberInstalled ? (
            <>
              <div className="page-description max-w-screen-sm">{t('phone_description')}</div>
              <Button color="primary" className="mt-4" onClick={openInstallPhoneModal}>
                {t('phone_button')}
              </Button>
            </>
          ) : null}
        </PageContainer>
      </div>

      <Tabs router={router} saveHistory>
        <div className="bg-primary-content">
          <PageContainer>
            <TabList>
              <Tab id="basic-data" panelId="panel-basic-data">
                {t('tabs.basic')}
              </Tab>
              <Tab id="dataset-data" panelId="panel-dataset-data">
                {t('tabs.dataset')}
              </Tab>
              {emergencyNumberInstalled ? (
                <Tab id="phone-data" panelId="panel-phone-data">
                  {t('tabs.emergency_numbers')}
                </Tab>
              ) : null}
              <Tab id="permissions-data" panelId="panel-permissions-data">
                {t('tabs.permissions')}
              </Tab>
            </TabList>
          </PageContainer>
        </div>

        <TabPanel id="panel-basic-data" tabId="basic-data">
          a
        </TabPanel>
        <TabPanel id="panel-dataset-data" tabId="dataset-data">
          <DatasetTabs t={t} />
        </TabPanel>
        {emergencyNumberInstalled ? (
          <TabPanel id="panel-dataset-data" tabId="dataset-data">
            <EmergencyNumbersTabs />
          </TabPanel>
        ) : null}
        <TabPanel id="panel-permissions-data" tabId="permissions-data">
          c
        </TabPanel>
      </Tabs>
    </>
  );
}

export default withLayout(Config);
