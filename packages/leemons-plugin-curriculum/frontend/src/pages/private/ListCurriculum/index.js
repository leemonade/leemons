import React, { useMemo, useEffect, useState } from 'react';
import { keyBy, map, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest, getPlatformLocalesRequest } from '@users/request';
import {
  Paper,
  Box,
  Stack,
  ActionButton,
  Tabs,
  TabPanel,
  PaginatedList,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { AdminPageHeader, LibraryCard } from '@bubbles-ui/leemons';
import { listCurriculumRequest } from '../../../request';

function getAsset(curriculum) {
  return {
    id: curriculum.id,
    name: curriculum?.name,
    tagline: curriculum?.description,
    tags: curriculum?.tags,
    created: curriculum?.created,
  };
}

function ListCurriculum() {
  const [t] = useTranslateLoader(prefixPN('listCurriculum'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const load = async () => {
    setLoading(true);
    try {
      const [
        {
          data: { items: _curriculums },
        },
        {
          data: { items: centers },
        },
        { locales },
      ] = await Promise.all([
        listCurriculumRequest({ page: 0, size: 999999 }),
        listCentersRequest({ page: 0, size: 999999 }),
        getPlatformLocalesRequest(),
      ]);

      const localesByCode = keyBy(locales, 'code');
      const centersById = keyBy(centers, 'id');

      setCurriculums(
        map(_curriculums, (curriculum) => ({
          ...curriculum,
          center: centersById[curriculum.center],
          locale: localesByCode[curriculum.locale],
        }))
      );
      setLoading(false);
    } catch (e) {
      console.error('e', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOnSelect = (curriculum) => {
    history.push(`/private/curriculum/${curriculum.id}/step/1`);
  };

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
  ];

  const listProps = useMemo(
    () => ({
      itemRender: ({ onClick, ...p }) => (
        <Box onClick={onClick} style={{ cursor: 'pointer' }}>
          <LibraryCard {...p} asset={p.item.original} variant="curriculum" />
        </Box>
      ),
      itemMinWidth: 330,
      margin: 16,
      spacing: 4,
      paperProps: { shadow: 'none', color: 'none', padding: 0 },
    }),
    []
  );

  const serverData = useMemo(
    () => ({
      items: curriculums?.map((curriculum) => getAsset(curriculum)),
      page: 0,
      size: 10,
      totalCount: curriculums?.length,
      totalPages: Math.ceil(curriculums?.length / 10),
    }),
    [curriculums]
  );

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader
        values={headerValues}
        buttons={{ new: tCommon('new') }}
        onNew={() => history.push(`/private/curriculum/new`)}
      />

      <Box style={{ flex: 1 }}>
        <Tabs usePageLayout={true} fullHeight>
          <TabPanel label="Published">
            <Box
              style={{ position: 'relative', display: 'flex', flex: 1, flexDirection: 'column' }}
            >
              <LoadingOverlay visible={loading} overlayOpacity={0} />
              {!loading && !isEmpty(curriculums) && (
                <Box
                  sx={(theme) => ({
                    paddingBottom: theme.spacing[5],
                    paddingTop: theme.spacing[5],
                  })}
                >
                  <PaginatedList
                    {...serverData}
                    {...listProps}
                    selectable
                    columns={columns}
                    loading={loading}
                    layout="grid"
                    onSelect={handleOnSelect}
                  />
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel label="Draft">
            <Box></Box>
          </TabPanel>
        </Tabs>
      </Box>
    </Stack>
  );
}

export default ListCurriculum;
