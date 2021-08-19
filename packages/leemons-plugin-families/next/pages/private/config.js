import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Tab, TabList, TabPanel, Tabs } from 'leemons-ui';
import { useRouter } from 'next/router';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

function Config() {
  useSession({ redirectTo: goLoginPage });
  const router = useRouter();

  const [t] = useTranslateLoader(prefixPN('config_page'));

  return (
    <>
      <PageHeader title={t('title')} />
      <div className="bg-primary-content">
        <PageContainer>
          <div className="page-description max-w-screen-sm">{t('description1')}</div>
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
          b
        </TabPanel>
        <TabPanel id="panel-permissions-data" tabId="permissions-data">
          c
        </TabPanel>
      </Tabs>
    </>
  );
}

export default withLayout(Config);
