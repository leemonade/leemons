import React, { useMemo, useState } from 'react';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import {
  ActionButton,
  Button,
  ContextContainer,
  Paper,
  Paragraph,
  Stack,
  Table,
  Box,
} from '@bubbles-ui/components';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { AddIcon } from '@bubbles-ui/icons/outline';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { useAsync } from '@common/useAsync';
import {
  getDatasetSchemaLocaleRequest,
  getDatasetSchemaRequest,
  removeDatasetFieldRequest,
} from '@dataset/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import formWithTheme from '@common/formWithTheme';
import PropTypes from 'prop-types';
import { useLayout } from '@layout/context';

function TabDescription({ t, type, className }) {
  return <div className={`page-description ${className}`}>{t(`${type}.description`)}</div>;
}

TabDescription.propTypes = {
  t: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};

function CommonFields({ t }) {
  const [dataTest, setDataTest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const { openDeleteConfirmationModal } = useLayout();

  const load = useMemo(() => () => getDatasetSchemaRequest('user-data', 'plugins.users'), []);

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
    },
    []
  );

  useAsync(load, onSuccess, onError);

  const load2 = useMemo(
    () => () => getDatasetSchemaLocaleRequest('user-data', 'plugins.users'),
    []
  );

  const onSuccess2 = useMemo(
    () =>
      ({ dataset }) => {
        setDataTest(dataset);
        setLoading(false);
      },
    []
  );

  const onError2 = useMemo(
    () => (e) => {
      // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
      if (e.code !== 4001) {
        setError(e);
      }
      setLoading(false);
    },
    []
  );

  useAsync(load2, onSuccess2, onError2);

  const [form] = formWithTheme(dataTest?.compileJsonSchema, dataTest?.compileJsonUI);

  async function reload() {
    try {
      setLoading(true);
      await onSuccess(await load());
      await onSuccess2(await load2());
    } catch (e) {
      onError(e);
    }
  }

  function onSave() {
    reload();
  }

  function newItem() {
    setItem(null);
    toggle();
  }

  function openItem(_item) {
    setItem(_item);
    toggle();
  }

  function removeItem(_item) {
    openDeleteConfirmationModal({
      title: t('remove_modal.title'),
      description: t('remove_modal.message'),
      onConfirm: async () => {
        try {
          await removeDatasetFieldRequest('user-data', 'plugins.users', _item.id);
          addSuccessAlert(t('dataset.deleted_done'));
          await reload();
        } catch (e) {
          addErrorAlert(getErrorMessage(e));
        }
      },
    })();
  }

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('basic.table.name'),
        accessor: (field) => (
          <div className="text-left">
            {field.schema.frontConfig.name} {field.schema.frontConfig.required ? '*' : ''}
          </div>
        ),
        className: 'text-left',
      },
      {
        Header: t('basic.table.description'),
        accessor: 'description',
        className: 'text-left',
      },
      {
        Header: t('basic.table.type'),
        accessor: (field) => (
          <div className="text-center">{tCommonTypes(field.schema.frontConfig.type)}</div>
        ),
        className: 'text-center',
      },
      {
        Header: t('basic.table.actions'),
        accessor: (field) => (
          <div className="text-center">
            <ActionButton
              tooltip={t('basic.edit')}
              icon={<EditWriteIcon />}
              onClick={() => openItem(field)}
            />
            <ActionButton
              tooltip={t('basic.delete')}
              icon={<DeleteBinIcon />}
              onClick={() => removeItem(field)}
            />
          </div>
        ),
        className: 'text-center',
      },
    ],
    [t, tCommonTypes]
  );

  return (
    <>
      <DatasetItemDrawer
        locationName="user-data"
        pluginName="plugins.users"
        item={item}
        onSave={onSave}
      />
      <ContextContainer
        sx={(theme) => ({ paddingTop: theme.spacing[4], paddingBottom: theme.spacing[4] })}
      >
        <ErrorAlert />
        {!loading && !error ? (
          <>
            <Stack alignItems="center" justifyContent="space-between">
              <Paragraph>{t('basic.description')}</Paragraph>
              <Button leftIcon={<AddIcon />} onClick={newItem}>
                {t('dataset.add_field')}
              </Button>
            </Stack>
            <Paper>
              <Table columns={tableHeaders} data={tableItems} />
            </Paper>
            {tableItems && tableItems.length ? (
              <Paper>
                <Box style={{ width: '50%' }}>{form}</Box>
              </Paper>
            ) : null}
          </>
        ) : null}
      </ContextContainer>
    </>
  );
}

CommonFields.propTypes = {
  t: PropTypes.func,
  getErrorMessage: PropTypes.func,
};

export { CommonFields };
