import React, { useEffect, useMemo, useState } from 'react';

import { Button, Box, Stack, Table, Text, ActionButton } from '@bubbles-ui/components';
import { AddCircleIcon, DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import prefixPN from '@dataset/helpers/prefixPN';
import { useDatasetSchema } from '@dataset/hooks/queries';
import { useDatasetItemDrawer } from '@dataset/hooks/useDatasetItemDrawer';
import { removeDatasetFieldRequest } from '@dataset/request';

function NameCell({ cell }) {
  const field = cell.row.original;
  return (
    <Box>
      {field.schema.frontConfig.name} {field.schema.frontConfig.required ? '*' : ''}
    </Box>
  );
}

NameCell.propTypes = {
  cell: PropTypes.object,
};

function ActionsCell({ cell, openItem, removeItem }) {
  const field = cell.row.original;
  return (
    <Stack>
      <ActionButton
        icon={<EditWriteIcon width={18} height={18} />}
        onClick={() => openItem(field)}
      />
      <ActionButton
        icon={<DeleteBinIcon width={18} height={18} />}
        onClick={() => removeItem(field)}
      />
    </Stack>
  );
}

ActionsCell.propTypes = {
  cell: PropTypes.object,
  openItem: PropTypes.func,
  removeItem: PropTypes.func,
};

const DatasetTable = ({ locationName, pluginName, description, isEditMode }) => {
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const [t] = useTranslateLoader(prefixPN('datasetTable'));
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const { openDeleteConfirmationModal } = useLayout();

  const {
    data: dataset,
    isLoading,
    refetch,
    isError,
    error: datasetError,
  } = useDatasetSchema({
    locationName,
    pluginName,
    options: { enabled: !!locationName && !!pluginName },
  });

  function newItem() {
    setItem(null);
    toggle();
  }

  function openItem(_item) {
    setItem(_item);
    toggle();
  }

  useEffect(() => {
    if (dataset) {
      setTableItems(getDatasetAsArrayOfProperties(dataset));
    } else {
      setTableItems([]);
    }
  }, [dataset]);

  useEffect(() => {
    // 4001 code that means that the schema does not exist yet, as it is possible to ignore the error
    if (isError && datasetError?.code !== 4001) {
      setError(datasetError);
    } else {
      setError(null);
    }
  }, [isError, datasetError]);

  const reload = () => {
    refetch();
  };

  function onSave() {
    reload();
  }

  const toggleModal = (item) =>
    openDeleteConfirmationModal({
      title: t('remove_modal.title'),
      description: t('remove_modal.message'),
      labels: {
        confirm: t('remove_modal.action'),
        cancel: t('remove_modal.cancel'),
      },
      onConfirm: async () => {
        try {
          await removeDatasetFieldRequest(locationName, pluginName, item.id);
          addSuccessAlert(t('deleted_done'));
          reload();
        } catch (e) {
          console.log('ERROR: itemToRemove:', item);
          addErrorAlert(getErrorMessage(e));
        }
      },
    })();

  function removeItem(_item) {
    toggleModal(_item);
  }

  const tableHeaders = useMemo(() => {
    const result = [
      {
        Header: t('columns.name'),
        accessor: 'name',
        Cell: NameCell,
      },
      {
        Header: t('columns.description'),
        accessor: 'description',
      },
      {
        Header: t('columns.type'),
        accessor: 'type',
        Cell: (field) => tCommonTypes(field.cell.row.original.schema.frontConfig.type),
      },
    ];
    if (isEditMode) {
      result.push({
        Header: t('columns.actions'),
        accessor: 'actions',
        Cell: (field) => <ActionsCell {...field} openItem={openItem} removeItem={removeItem} />,
        tdStyle: { width: 80, verticalAlign: 'middle' },
      });
    }
    return result;
  }, [t, tCommonTypes, isEditMode]);

  return (
    <Stack direction="column" spacing={4}>
      <ErrorAlert />
      {!error && (
        <>
          <Stack alignItems="center" justifyContent="space-between" fullWidth>
            {!!description && <Text>{t(`description`)}</Text>}
            {isEditMode && (
              <Button variant="link" onClick={newItem} leftIcon={<AddCircleIcon />}>
                {t('add_field')}
              </Button>
            )}
          </Stack>
          <DatasetItemDrawer
            locationName={locationName}
            pluginName={pluginName}
            item={item}
            onSave={onSave}
          />
        </>
      )}
      {!isLoading && !error && tableItems?.length > 0 && (
        <Table columns={tableHeaders} data={tableItems} />
      )}
    </Stack>
  );
};

DatasetTable.propTypes = {
  locationName: PropTypes.string,
  pluginName: PropTypes.string,
  description: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export { DatasetTable };
