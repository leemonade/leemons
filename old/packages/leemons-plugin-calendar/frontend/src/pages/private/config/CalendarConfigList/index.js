import React from 'react';

/*
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { Link, useHistory } from 'react-router-dom';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
// import { PageContainer, PageHeader, Table } from 'leemons--ui';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { listCalendarConfigsRequest, removeCalendarConfigRequest } from '@calendar/request';


 */
function ConfigsList() {
  return 'Pasar a bubbles-ui';
  /*
  const [t] = useTranslateLoader(prefixPN('list_page'));
  const { t: tCommon } = useCommonTranslate('page_header');

  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const [list, setList] = useState([]);

  const history = useHistory();

  const getConfigList = async () => {
    const { configs } = await listCalendarConfigsRequest();
    return configs;
  };

  const init = async (canRoute) => {
    const configs = await getConfigList();
    if (!configs.length && canRoute) {
      return history.push('/private/calendar/config/detail/new');
    }
    setList(configs);
    return null;
  };

  const goDetailPage = () => {
    history.push('/private/calendar/config/detail/new');
  };

  useEffect(() => {
    init(true);
  }, []);

  const removeItem = async (item) => {
    try {
      // Todo: Añadir modal de asegurar borrado
      await removeCalendarConfigRequest(item.id);
      await init();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
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
              <Link
                to={`/private/calendar/config/detail/${item.id}`}
                className="text-sm text-primary"
              >
                {t('view')}
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

   */
}

export default ConfigsList;
