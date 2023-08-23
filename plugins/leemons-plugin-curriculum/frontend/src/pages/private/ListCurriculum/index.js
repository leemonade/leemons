import {
  Box,
  ContextContainer,
  LoadingOverlay,
  PaginatedList,
  TabPanel,
  Tabs,
  Title,
} from '@bubbles-ui/components';
import { ViewOnIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { AdminPageHeader, LibraryCard } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@curriculum/helpers/prefixPN';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import {
  getPermissionsWithActionsIfIHaveRequest,
  getPlatformLocalesRequest,
  listCentersRequest,
} from '@users/request';
import { filter, isEmpty, keyBy, map } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const [store, render] = useStore({
    canAdd: false,
  });
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
        { permissions },
      ] = await Promise.all([
        listCurriculumRequest({ page: 0, size: 999999, canListUnpublished: true }),
        listCentersRequest({ page: 0, size: 999999 }),
        getPlatformLocalesRequest(),
        getPermissionsWithActionsIfIHaveRequest(['plugins.curriculum.curriculum']),
      ]);

      if (
        permissions[0] &&
        (permissions[0].actionNames.includes('admin') ||
          permissions[0].actionNames.includes('create'))
      ) {
        store.canAdd = true;
      }
      if (
        permissions[0] &&
        (permissions[0].actionNames.includes('admin') ||
          permissions[0].actionNames.includes('delete'))
      ) {
        store.canDelete = true;
      }

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
    history.push(`/private/curriculum/${curriculum.id}`);
  };

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
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
        ];
        if (store.canDelete) {
          menuItems.push({
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
          });
        }
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
    [t, store.canDelete]
  );

  const serverData = useMemo(
    () => ({
      items: curriculums?.map((curriculum) => getAsset(curriculum)) || [],
      page: 0,
      size: 10,
      totalCount: curriculums?.length,
      totalPages: Math.ceil(curriculums?.length / 10),
    }),
    [curriculums]
  );

  const cy = filter(serverData.items, { published: true });
  const cn = filter(serverData.items, { published: false });

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={headerValues}
        buttons={store.canAdd ? { new: tCommon('new') } : {}}
        onNew={() => history.push(`/private/curriculum/new`)}
      />

      <Tabs usePageLayout panelColor="solid" fullHeight fullWidth>
        <TabPanel label={t('published')}>
          <Box
            style={{
              height: '100%',
              position: 'relative',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
          >
            <LoadingOverlay visible={loading} overlayOpacity={0} />
            {!loading && !isEmpty(cy) && (
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
            {!loading && isEmpty(cy) && (
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                })}
              >
                <Title order={3}>{t('empty')}</Title>
              </Box>
            )}
          </Box>
        </TabPanel>
        {store.canAdd ? (
          <TabPanel label={t('draft')}>
            <Box
              style={{
                height: '100%',
                position: 'relative',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
              }}
            >
              <LoadingOverlay visible={loading} overlayOpacity={0} />
              {!loading && !isEmpty(cn) && (
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
              {!loading && isEmpty(cn) && (
                <Box
                  sx={(theme) => ({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  })}
                >
                  <Title order={3}>{t('empty')}</Title>
                </Box>
              )}
            </Box>
          </TabPanel>
        ) : null}
      </Tabs>
    </ContextContainer>
  );
}

export default ListCurriculum;
