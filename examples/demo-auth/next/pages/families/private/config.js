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

  const [t] = useTranslateLoader(prefixPN('user_data_page'));

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
          a
        </TabPanel>
        <TabPanel id="panel-basic-data" tabId="basic-data">
          b
        </TabPanel>
      </Tabs>
    </>
  );
}

export default withLayout(Config);
