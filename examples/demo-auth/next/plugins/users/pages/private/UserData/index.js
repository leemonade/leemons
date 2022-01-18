import React, { useEffect, useMemo, useState } from 'react';
import { getUserProfilesRequest } from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import prefixPN from '@users/helpers/prefixPN';
import { withLayout } from '@layout/hoc';
import {
  Button,
  Card,
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
import { PlusIcon } from '@heroicons/react/outline';
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
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import PropTypes from 'prop-types';

function TabDescription({ t, type, className }) {
  return <div className={`page-description ${className}`}>{t(`${type}.description`)}</div>;
}

TabDescription.propTypes = {
  t: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};

function LoginTab({ t }) {
  return (
    <div className="bg-primary-content">
      <PageContainer>
        <TabDescription className="mb-6" t={t} type="login" />
      </PageContainer>
    </div>
  );
}

LoginTab.propTypes = {
  t: PropTypes.func,
};

function BasicTab({ t }) {
  const [dataTest, setDataTest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

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

  console.log(JSON.stringify(dataTest));
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

  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('remove_modal.title'),
    message: t('remove_modal.message'),
    cancelLabel: t('remove_modal.cancel'),
    actionLabel: t('remove_modal.action'),
    onAction: async () => {
      try {
        await removeDatasetFieldRequest('user-data', 'plugins.users', itemToRemove.id);
        addSuccessAlert(t('dataset.deleted_done'));
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

  function openItem(_item) {
    setItem(_item);
    toggle();
  }

  function removeItem(_item) {
    setItemToRemove(_item);
    toggleModal();
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
            <Button color="primary" text onClick={() => openItem(field)}>
              {t('basic.edit')}
            </Button>
            <Button color="primary" text onClick={() => removeItem(field)}>
              {t('basic.delete')}
            </Button>
          </div>
        ),
        className: 'text-center',
      },
    ],
    [t, tCommonTypes]
  );

  return (
    <div>
      <Modal {...modal} />
      <div className="bg-primary-content">
        <PageContainer className="pt-0">
          <ErrorAlert />
          {!loading && !error ? (
            <div className="pt-6 mb-6 flex flex-row justify-between items-center">
              <TabDescription className="mb-0" t={t} type="basic" />
              <Button color="secondary" onClick={newItem}>
                <PlusIcon className="w-6 h-6 mr-1" />
                {t('dataset.add_field')}
              </Button>
              <DatasetItemDrawer
                locationName="user-data"
                pluginName="plugins.users"
                item={item}
                onSave={onSave}
              />
            </div>
          ) : null}
        </PageContainer>
      </div>
      {!loading && !error ? (
        <>
          <PageContainer>
            <div className="bg-primary-content p-4">
              {tableItems && tableItems.length ? (
                <Table columns={tableHeaders} data={tableItems} />
              ) : (
                <div className="text-center">{t('dataset.no_data_in_table')}</div>
              )}
            </div>
          </PageContainer>

          {tableItems && tableItems.length ? (
            <PageContainer>
              <div className="bg-primary-content p-4">
                <Card className="bordered p-6">{form}</Card>
              </div>
            </PageContainer>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

BasicTab.propTypes = {
  t: PropTypes.func,
};

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserData() {
  const [t] = useTranslateLoader(prefixPN('user_data_page'));

  async function getProfiles() {
    try {
      const { profiles } = await getUserProfilesRequest();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      <PageHeader title={t('page_title')} />
      <div className="bg-primary-content">
        <PageContainer>
          <div
            className="page-description"
            dangerouslySetInnerHTML={{ __html: t('page_description') }}
          />
        </PageContainer>
      </div>

      <Tabs saveHistory>
        <div className="bg-primary-content">
          <PageContainer>
            <TabList>
              <Tab id="login-data" panelId="panel-login-data">
                {t('tabs.login_data')}
              </Tab>
              <Tab id="basic-data" panelId="panel-basic-data">
                {t('tabs.basic_data')}
              </Tab>
            </TabList>
          </PageContainer>
        </div>

        <TabPanel id="panel-login-data" tabId="login-data">
          <LoginTab t={t} />
        </TabPanel>
        <TabPanel id="panel-basic-data" tabId="basic-data">
          <BasicTab t={t} />
        </TabPanel>
      </Tabs>
    </>
  );
}

export default UserData;
