import React, { useEffect, useMemo, useState } from 'react';
import { filter, isEmpty, keyBy, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@curriculum/helpers/prefixPN';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import { getPlatformLocalesRequest, listCentersRequest } from '@users/request';
import { Box, LoadingOverlay, PaginatedList, Stack, TabPanel, Tabs } from '@bubbles-ui/components';
import { AdminPageHeader, LibraryCard } from '@bubbles-ui/leemons';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { deleteCurriculumRequest, listCurriculumRequest } from '../../../request';

function getAsset(curriculum) {
  return {
    id: curriculum.id,
    name: curriculum?.name,
    tagline: curriculum?.description,
    tags: curriculum?.tags,
    step: curriculum?.step,
    created: curriculum?.created,
    published: !!curriculum?.published,
  };
}

function ListCurriculum() {
  const [t] = useTranslateLoader(prefixPN('listCurriculum'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

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
        listCurriculumRequest({ page: 0, size: 999999, canListUnpublished: true }),
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
    history.push(`/private/curriculum/${curriculum.id}/step/${curriculum.step || 1}`);
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
      itemRender: ({ onClick, ...p }) => {
        const menuItems = [
          {
            icon: <ViewOnIcon />,
            children: t('view'),
            onClick: (e) => {
              e.stopPropagation();
              handleOnSelect(p.item.original);
            },
          },
          {
            icon: <DeleteBinIcon />,
            children: t('delete'),
            onClick: (e) => {
              e.stopPropagation();
              openDeleteConfirmationModal({
                onConfirm: async () => {
                  try {
                    await deleteCurriculumRequest(p.item.original.id);
                    addSuccessAlert(t('deleted'));
                    load();
                  } catch (err) {
                    addErrorAlert(getErrorMessage(err));
                  }
                },
              })();
            },
          },
        ];
        return (
          <Box onClick={onClick} style={{ cursor: 'pointer' }}>
            <LibraryCard
              {...p}
              menuItems={menuItems}
              asset={p.item.original}
              variant="curriculum"
            />
          </Box>
        );
      },
      itemMinWidth: 330,
      margin: 16,
      spacing: 4,
      paperProps: { shadow: 'none', color: 'none', padding: 0 },
    }),
    [t]
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

  console.log(serverData);

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader
        values={headerValues}
        buttons={{ new: tCommon('new') }}
        onNew={() => history.push(`/private/curriculum/new`)}
      />

      <Box style={{ flex: 1 }}>
        <Tabs usePageLayout={true} fullHeight>
          <TabPanel label={t('published')}>
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
                    items={filter(serverData.items, { published: true })}
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
          <TabPanel label={t('draft')}>
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
                    items={filter(serverData.items, { published: false })}
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
        </Tabs>
      </Box>
    </Stack>
  );
}

export default ListCurriculum;
