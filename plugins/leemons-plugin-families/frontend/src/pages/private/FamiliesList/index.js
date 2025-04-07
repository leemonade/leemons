import {
  Badge,
  Box,
  ContextContainer,
  PageContainer,
  Paper,
  SearchInput,
  Table,
  Text,
} from "@bubbles-ui/components";
// TODO: fix this import from @common plugin
import { AdminPageHeader } from "@bubbles-ui/leemons";
import { useAsync } from "@common/useAsync";
import useRequestErrorMessage from "@common/useRequestErrorMessage";
import prefixPN from "@families/helpers/prefixPN";
import { listFamiliesRequest } from "@families/request";
import useCommonTranslate from "@multilanguage/helpers/useCommonTranslate";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import * as _ from "lodash";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function List() {
  const config = useRef({
    page: 0,
    size: 10,
  });
  const navigate = useNavigate();
  const [t] = useTranslateLoader(prefixPN("list_page"));
  const { t: tCommon } = useCommonTranslate("page_header");
  const [loadingError, setLoadingError, LoadingErrorAlert] = useRequestErrorMessage();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const tableHeaders = useMemo(
    () => [
      {
        Header: t("table.family") || "Family",
        accessor: "name",
        className: "text-left",
      },
      {
        Header: t("table.guardians") || "Guardians",
        accessor: ({ nGuardians }) => <Text>{nGuardians}</Text>,
        className: "text-center",
      },
      {
        Header: t("table.students") || "Students",
        accessor: ({ nStudents }) => <Text>{nStudents}</Text>,
        className: "text-center",
      },
      {
        Header: t("table.actions") || "Actions",
        accessor: "actions",
        className: "text-right",
      },
    ],
    [t]
  );

  const tableItems = useMemo(
    () =>
      pagination
        ? _.map(pagination.items, (item) => {
            item.name = <Text strong>{item.name}</Text>;
            item.actions = (
              <Box>
                <Link to={`/private/families/detail/${item.id}`} className="text-sm text-primary">
                  {t("view")}
                </Link>
              </Box>
            );
            return item;
          })
        : [],
    [t, pagination]
  );

  async function list() {
    const { data } = await listFamiliesRequest(config.current);
    return data;
  }

  const goDetailPage = () => {
    navigate("/private/families/detail");
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
      config.current.query = { name: { $regex: searchValue, $options: "i" } };
    }
    setPagination(await list());
  };

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{ title: t("title"), description: t("description") }}
        buttons={{ new: tCommon("new") }}
        onNew={goDetailPage}
      />
      {pagination && (
        <>
          <PageContainer>
            <Badge size="md" color="stroke" closable={false}>
              {t("families", { n: pagination?.totalCount })}
            </Badge>
          </PageContainer>
          <Paper color="solid" shadow="none" padding="none" fullWidth>
            <PageContainer noFlex>
              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <SearchInput
                  label={t("search")}
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder={t("search")}
                />
              </Box>
              <Paper padding={2} mt={20} mb={20} fullWidth>
                <LoadingErrorAlert />
                {!loading && !loadingError && (
                  <Box>
                    <Table columns={tableHeaders} data={tableItems} />
                  </Box>
                )}
              </Paper>
              <LoadingErrorAlert />
            </PageContainer>
          </Paper>
        </>
      )}
    </ContextContainer>
  );
}

export default List;
