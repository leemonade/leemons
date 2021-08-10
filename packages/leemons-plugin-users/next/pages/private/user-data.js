import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from '@users/session';
import { getUserProfilesRequest } from '@users/request';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
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
import { PlusIcon } from '@heroicons/react/outline';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { useRouter } from 'next/router';
import { useAsync } from '@common/useAsync';
import { getDatasetSchemaRequest, removeDatasetFieldRequest } from '@dataset/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

function TabDescription({ t, type, className }) {
  return <div className={`text-base text-secondary ${className}`}>{t(`${type}.description`)}</div>;
}

function LoginTab({ t }) {
  return (
    <div className="bg-primary-content">
      <PageContainer>
        <TabDescription className="mb-6" t={t} type="login" />
      </PageContainer>
    </div>
  );
}

function BasicTab({ t }) {
  const [loading, setLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [item, setItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  const [error, setError, ErrorAlert] = useRequestErrorMessage();
  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('remove_modal.title'),
    message: t('remove_modal.message'),
    cancelLabel: t('remove_modal.cancel'),
    actionLabel: t('remove_modal.action'),
    onAction: async () => {
      await removeDatasetFieldRequest('user-data', 'plugins.users', itemToRemove.id);
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
            <Button color="ghost" className="text-primary" onClick={() => openItem(field)}>
              {t('basic.edit')}
            </Button>
            <Button color="ghost" className="text-primary" onClick={() => removeItem(field)}>
              {t('basic.delete')}
            </Button>
          </div>
        ),
        className: 'text-center',
      },
    ],
    [t, tCommonTypes]
  );

  const load = useMemo(() => () => getDatasetSchemaRequest('user-data', 'plugins.users'), []);

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
    },
    []
  );

  useAsync(load, onSuccess, onError);

  return (
    <div>
      <Modal {...modal} />
      <div className="bg-primary-content">
        <PageContainer className="pt-0">
          <div className="pt-6 mb-6 flex flex-row justify-between items-center">
            <TabDescription className="mb-0" t={t} type="basic" />
            <Button color="secondary" onClick={newItem}>
              <PlusIcon className="w-6 h-6 mr-1" />
              {t('dataset.add_field')}
            </Button>
            <DatasetItemDrawer locationName="user-data" pluginName="plugins.users" item={item} />
          </div>
        </PageContainer>
      </div>
      <PageContainer>
        <div className="bg-primary-content p-2">
          <ErrorAlert />
          {!loading && !error ? (
            <div>
              <Table columns={tableHeaders} data={tableItems} />
            </div>
          ) : null}
        </div>
      </PageContainer>
    </div>
  );
}

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserData() {
  useSession({ redirectTo: goLoginPage });

  const router = useRouter();
  const [translations] = useTranslate({ keysStartsWith: prefixPN('user_data_page') });
  const t = tLoader(prefixPN('user_data_page'), translations);

  async function getProfiles() {
    try {
      const { profiles: _profiles } = await getUserProfilesRequest();
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
            className="text-base text-secondary pb-6"
            dangerouslySetInnerHTML={{ __html: t('page_description') }}
          />
        </PageContainer>
      </div>

      <Tabs router={router} saveHistory>
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

export default withLayout(UserData);
