import { useEffect, useMemo, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { useRouter } from 'next/router';
import listCalendarConfigs from '@calendar/request/listCalendarConfigs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import Link from 'next/link';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { PageContainer, PageHeader, Table } from 'leemons-ui';

function ConfigsList() {
  useSession({ redirectTo: goLoginPage });

  const [t] = useTranslateLoader(prefixPN('list_page'));
  const { t: tCommon } = useCommonTranslate('page_header');

  const [list, setList] = useState([]);

  const router = useRouter();

  const getConfigList = async () => {
    const { configs } = await listCalendarConfigs();
    return configs;
  };

  const init = async () => {
    const configs = await getConfigList();
    if (!configs.length) {
      return router.push('/calendar/config/detail/new');
    }
    setList(configs);
    return null;
  };

  const goDetailPage = () => {
    router.push('/calendar/config/detail/new');
  };

  useEffect(() => {
    init();
  }, []);

  const removeItem = async (item) => {
    console.log(item);
  };

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('name'),
        accessor: 'title',
        className: 'text-left',
      },
      {
        Header: t('country'),
        accessor: 'countryName',
        className: 'text-left',
      },
      {
        Header: t('region'),
        accessor: 'regionName',
        className: 'text-left',
      },
      {
        Header: t('actions'),
        accessor(item) {
          return (
            <div className="text-right">
              <Link href={`/calendar/config/detail/${item.id}`}>
                <a className="text-sm text-primary">{t('view')}</a>
              </Link>
              &nbsp;|&nbsp;
              <a onClick={() => removeItem(item)} className="text-sm text-primary cursor-pointer">
                {t('remove')}
              </a>
            </div>
          );
        },
        className: 'text-right',
      },
    ],
    [t]
  );

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('title_description')}
        newButton={tCommon('new')}
        onNewButton={goDetailPage}
      />
      <div className="bg-primary-content">
        <PageContainer>
          <Table columns={tableHeaders} data={list} />
        </PageContainer>
      </div>
    </>
  );
}

export default withLayout(ConfigsList);
