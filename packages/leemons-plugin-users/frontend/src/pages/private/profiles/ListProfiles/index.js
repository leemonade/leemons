import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { listProfilesRequest } from '@users/request';
import { goDetailProfilePage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Table } from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@users/helpers/prefixPN';
import { Link, useHistory } from 'react-router-dom';

function ListProfiles() {
  const [t] = useTranslateLoader(prefixPN('list_profiles'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const history = useHistory();

  const tableHeaders = useMemo(
    () => [
      {
        Header: t('name'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('overview'),
        accessor: 'description',
        className: 'text-left',
      },
      {
        Header: t('actions'),
        accessor: 'actions',
        className: 'text-right',
      },
    ],
    [t]
  );

  const tableItems = useMemo(
    () =>
      pagination
        ? _.map(pagination.items, (item) => ({
            ...item,
            name: <div className="font-semibold">{item.name}</div>,
            actions: (
              <div className="text-right">
                <Link
                  to={`/private/users/profiles/detail/${item.uri}`}
                  className="text-sm text-primary"
                >
                  {t('view')}
                </Link>
              </div>
            ),
          }))
        : [],
    [t, pagination]
  );

  async function listProfiles() {
    const { data } = await listProfilesRequest({
      page: 0,
      size: 10,
    });

    setPagination(data);
  }

  const load = async () => {
    try {
      await listProfiles();
      setLoading(false);
    } catch (err) {
      setLoadingError(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageHeader
        title={t('page_title')}
        newButton={tCommon('new')}
        onNewButton={() => goDetailProfilePage(history)}
      />
      <div className="bg-primary-content">
        <PageContainer>
          <div className="page-description pb-6 max-w-screen-sm">{t('page_description')}</div>
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

export default ListProfiles;
