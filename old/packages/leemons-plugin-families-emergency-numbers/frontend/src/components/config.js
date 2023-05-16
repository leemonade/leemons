import React, { useState, useMemo } from 'react';
import { Button, Modal, PageContainer, Table, Text } from '@bubbles-ui/components';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { getDatasetSchemaRequest, removeDatasetFieldRequest } from '@dataset/request';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import { CheckIcon, PlusIcon } from '@heroicons/react/outline';
import { useAsync } from '@common/useAsync';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@families-emergency-numbers/helpers/prefixPN';
import { PackageManagerService } from '@package-manager/services';

function Config() {
  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const [t] = useTranslateLoader(prefixPN('config_page'));
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const [removingEmergencyNumber, setRemovingEmergencyNumber] = useState(false);
  const [emergencyNumberInstalled, setEmergencyNumberInstalled] = useState(true);
  const [removeOpened, setRemoveOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  function newItem() {
    setItem(null);
    toggle();
  }

  function openItem(_item) {
    setItem(_item);
    toggle();
  }

  const load = useMemo(
    () => () =>
      getDatasetSchemaRequest(
        `families-emergency-numbers-data`,
        'plugins.families-emergency-numbers'
      ),
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

  async function reload() {
    try {
      setLoading(true);
      await onSuccess(await load());
    } catch (e) {
      onError(e);
    }
  }

  function removeItem(_item) {
    setItemToRemove(_item);
    setModalOpened(true);
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

  const removeAddon = () => {
    setRemoveOpened(true);
  };

  const removePhoneAddon = async () => {
    try {
      setRemovingEmergencyNumber(true);
      await PackageManagerService.removePluginByNPM(
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
      setRemovingEmergencyNumber(false);
    }
  };

  return (
    <>
      <Modal
        title={removingEmergencyNumber ? '' : t('phone_modal.title')}
        opened={removeOpened}
        onClose={() => setRemoveOpened(false)}
      >
        {removingEmergencyNumber ? (
          <div className="text-center pt-4">
            <Button color="primary" className="btn-xl" loading={emergencyNumberInstalled} text>
              {!emergencyNumberInstalled ? <CheckIcon className="w-7 h-7 mr-2" /> : null}
              <span className="text-secondary">
                {emergencyNumberInstalled ? t('phone_modal.removing') : t('phone_modal.removed')}
              </span>
            </Button>
          </div>
        ) : (
          <>
            <div className="text-sm text-secondary mb-6">{t('phone_modal.message')}</div>
            <div className="mt-6 flex flex-row gap-2 justify-end">
              <Button color="ghost" onClick={() => setRemoveOpened(false)}>
                {t('phone_modal.cancel')}
              </Button>
              <Button color="primary" onClick={removePhoneAddon}>
                {t('phone_modal.action')}
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        title={t('remove_modal.title')}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      >
        <Text>{t('remove_modal.message')}</Text>
        <div className="mt-6 flex flex-row gap-2 justify-end">
          <Button color="ghost" onClick={() => setModalOpened(false)}>
            {t('phone_modal.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={async () => {
              try {
                await removeDatasetFieldRequest(
                  `families-emergency-numbers-data`,
                  'plugins.families-emergency-numbers',
                  itemToRemove.id
                );
                addSuccessAlert(t('dataset_tab.deleted_done'));
                await reload();
              } catch (e) {
                addErrorAlert(getErrorMessage(e));
              }
            }}
          >
            {t('phone_modal.action')}
          </Button>
        </div>
      </Modal>
      <div className="bg-primary-content">
        <PageContainer className="pt-0">
          <ErrorAlert />
          {!loading && !error ? (
            <div className="pt-6 mb-6">
              <Button color="primary" onClick={removeAddon}>
                {t('deactivate_addon')}
              </Button>

              <div
                className="mt-4 mb-4"
                dangerouslySetInnerHTML={{ __html: t('message_important') }}
              />

              <div className="flex flex-row justify-end items-center">
                <Button color="secondary" onClick={newItem}>
                  <PlusIcon className="w-6 h-6 mr-1" />
                  {t('dataset_tab.add_field')}
                </Button>
              </div>

              <DatasetItemDrawer
                locationName={`families-emergency-numbers-data`}
                pluginName="plugins.families-emergency-numbers"
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
                <Text>{t('dataset_tab.no_data_in_table')}</Text>
              )}
            </div>
          </div>
        </PageContainer>
      ) : null}
    </>
  );
}

export default Config;
