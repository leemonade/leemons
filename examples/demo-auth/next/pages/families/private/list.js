import * as _ from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { useSession } from '@users/session';
import { listFamiliesRequest } from '@families/request';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { FormControl, Input, PageContainer, PageHeader, Table } from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@families/helpers/prefixPN';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAsync } from '@common/useAsync';
import { SearchIcon } from '@heroicons/react/outline';

function List() {
  useSession({ redirectTo: goLoginPage });
  const config = useRef({
    page: 0,
    size: 10,
  });
  const router = useRouter();
  const [t] = useTranslateLoader(prefixPN('list_page'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('table.family'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('table.guardians'),
        accessor: ({ nGuardians }) => <div className="text-center">{nGuardians}</div>,
        className: 'text-center',
      },
      {
        Header: t('table.students'),
        accessor: ({ nStudents }) => <div className="text-center">{nStudents}</div>,
        className: 'text-center',
      },
      {
        Header: t('table.actions'),
        accessor: 'actions',
        className: 'text-right',
      },
    ],
    [t]
  );

  const tableItems = useMemo(() => {
    return pagination
      ? _.map(pagination.items, (item) => {
          item.name = <div className="font-semibold">{item.name}</div>;
          item.actions = (
            <div className="text-right">
              <Link href={`/families/private/detail/${item.id}`}>
                <a className="text-sm text-primary">{t('view')}</a>
              </Link>
            </div>
          );
          return item;
        })
      : [];
  }, [t, pagination]);

  async function list() {
    const { data } = await listFamiliesRequest(config.current);
    return data;
  }

  const goDetailPage = () => {
    router.push('/families/private/detail');
  };

  const load = useMemo(
    () => () => {
      setLoading(true);
      return list();
    },
    []
  );

  const onSuccess = useMemo(
    () => (data) => {
      setPagination(data);
      setLoading(false);
    },
    []
  );

  const onError = useMemo(
    () => (e) => {
      setLoadingError(e);
      setLoading(false);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  const search = async () => {
    delete config.current.query;
    if (searchValue) {
      config.current.query = { name_$contains: searchValue };
    }
    setPagination(await list());
  };

  return (
    <>
      <PageHeader title={t('title')} newButton={tCommon('new')} onNewButton={goDetailPage} />
      <div className="bg-primary-content">
        <PageContainer>
          <div className="page-description pb-6 max-w-screen-sm">{t('description')}</div>
          {pagination ? (
            <>
              <div className="page-description pb-6 max-w-screen-sm">
                {t('families', { n: pagination.totalCount })}
              </div>
              <div className="flex">
                <FormControl label={t('search')}>
                  <div className="relative">
                    <SearchIcon
                      onClick={search}
                      className={`w-6 h-6 transition absolute right-2 top-2 ${
                        searchValue ? 'text-secondary cursor-pointer' : 'text-base-300'
                      }`}
                    />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyEnter={search}
                      outlined={true}
                      placeholder={t('search')}
                      className="pr-10"
                    />
                  </div>
                </FormControl>
              </div>
            </>
          ) : null}
        </PageContainer>
      </div>
      <PageContainer>
        <LoadingErrorAlert />
        <div className="bg-primary-content p-4">
          {!loading && !loadingError ? (
            <div>
              <Table columns={tableHeaders} data={tableItems} />
            </div>
          ) : null}
        </div>
      </PageContainer>
    </>
  );
}

export default withLayout(List);
