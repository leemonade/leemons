import React, { useEffect, useState } from 'react';
import { useSession } from '@users/session';
import { getUserProfilesRequest } from '@users/request';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader } from 'leemons-ui';

function LoginTab() {
  return <div>Login</div>;
}

function BasicTab() {
  return <div>Basic</div>;
}

function DatasetTab() {
  return <div>dATASET</div>;
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
          {tab}
          {tab === 0 && <div>{LoginTab()}</div>}
          {tab === 1 && <div>{BasicTab()}</div>}
          {tab === 2 && <div>{DatasetTab()}</div>}
        </PageContainer>
      </div>
    </>
  );
}

export default withLayout(UserData);
