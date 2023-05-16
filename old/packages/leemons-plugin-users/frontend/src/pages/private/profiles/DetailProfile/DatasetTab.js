import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, PageContainer, Table } from '@bubbles-ui/components';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { getDatasetSchemaRequest, removeDatasetFieldRequest } from '@dataset/request';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import { useAsync } from '@common/useAsync';
import { PlusIcon } from '@heroicons/react/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

import { useLayout } from '@layout/context';

// eslint-disable-next-line import/prefer-default-export
export const DatasetTab = ({ profile, t, isEditMode }) => {
  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const { openDeleteConfirmationModal } = useLayout();

  function newItem() {
    setItem(null);
    toggle();
  }

  function openItem(_item) {
    setItem(_item);
    toggle();
  }

  const load = useMemo(
    () => () => getDatasetSchemaRequest(`profile.${profile.id}`, 'plugins.users'),
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

  function onSave() {
    reload();
  }

  const toggleModal = openDeleteConfirmationModal({
    title: t('remove_modal.title'),
    description: t('remove_modal.message'),
    labels: {
      confirm: t('remove_modal.action'),
      cancel: t('remove_modal.cancel'),
    },
    onConfirm: async () => {
      try {
        await removeDatasetFieldRequest(`profile.${profile.id}`, 'plugins.users', itemToRemove.id);
        addSuccessAlert(t('dataset_tab.deleted_done'));
        reload();
      } catch (e) {
        addErrorAlert(getErrorMessage(e));
      }
    },
  });

  function removeItem(_item) {
    setItemToRemove(_item);
    toggleModal();
  }

  const tableHeaders = useMemo(() => {
    const result = [
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
    ];
    if (isEditMode) {
      result.push({
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
      });
    }
    return result;
  }, [t, tCommonTypes, isEditMode]);

  return (
    <>
      <div className="bg-primary-content">
        <PageContainer className="pt-0">
          <ErrorAlert />
          {!loading && !error ? (
            <div className="pt-6 mb-6 flex flex-row justify-between items-center">
              <div className="text-base text-secondary">{t(`dataset_tab.description`)}</div>
              {isEditMode ? (
                <Button color="secondary" onClick={newItem}>
                  <PlusIcon className="w-6 h-6 mr-1" />
                  {t('dataset_tab.add_field')}
                </Button>
              ) : null}

              <DatasetItemDrawer
                locationName={`profile.${profile.id}`}
                pluginName="plugins.users"
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
};

DatasetTab.propTypes = {
  profile: PropTypes.any,
  t: PropTypes.func,
  isEditMode: PropTypes.bool,
};
