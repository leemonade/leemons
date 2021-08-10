import React, { useEffect, useState } from 'react';
import { useSession } from '@users/session';
import { getUserProfilesRequest } from '@users/request';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { withLayout } from '@layout/hoc';
import { Button, PageContainer, PageHeader } from 'leemons-ui';
import { PlusIcon } from '@heroicons/react/outline';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';

function TabDescription({ t, type }) {
  return <div className="text-base text-secondary pb-6">{t(`${type}.description`)}</div>;
}

function LoginTab({ t }) {
  return (
    <div className="pt-6">
      <TabDescription t={t} type="login" />
    </div>
  );
}

function BasicTab({ t }) {
  return (
    <div className="pt-6">
      <TabDescription t={t} type="basic" />
    </div>
  );
}

function DatasetTab({ t }) {
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();

  return (
    <div className="pt-6">
      <TabDescription t={t} type="dataset" />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">b</div>
        <div>
          <Button color="secondary" onClick={toggle}>
            <PlusIcon className="w-6 h-6 mr-1" />
            {t('dataset.add_field')}
          </Button>
        </div>
      </div>
      <DatasetItemDrawer />
    </div>
  );
}

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function UserData() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('user_data_page') });
  const t = tLoader(prefixPN('user_data_page'), translations);

  const [tab, setTab] = useState(0);

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
          <div className="mt-2 text-xs tabs">
            <div
              className={`tab tab-lifted ${tab === 0 && 'tab-active'}`}
              onClick={() => setTab(0)}
            >
              {t('tabs.login_data')}
            </div>
            <div
              className={`tab tab-lifted ${tab === 1 && 'tab-active'}`}
              onClick={() => setTab(1)}
            >
              {t('tabs.basic_data')}
            </div>
            <div
              className={`tab tab-lifted ${tab === 2 && 'tab-active'}`}
              onClick={() => setTab(2)}
            >
              {t('tabs.user_dataset')}
            </div>
            <div className="flex-1 cursor-default tab tab-lifted"></div>
          </div>
          {tab === 0 && <LoginTab t={t} />}
          {tab === 1 && <BasicTab t={t} />}
          {tab === 2 && <DatasetTab t={t} />}
        </PageContainer>
      </div>
    </>
  );
}

export default withLayout(UserData);
