/* eslint-disable no-nested-ternary */
import React from 'react';
import { findIndex, forEach, map } from 'lodash';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  createStyles,
  ImageLoader,
  Loader,
  Paragraph,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { AddCircleIcon, EditIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { listCentersRequest, removeCenterRequest } from '@users/request';
import AddCenterDrawer from '@admin/pages/private/Setup/components/AddCenterDrawer';
import { getLanguagesRequest } from '@admin/request/settings';
import { useLayout } from '@layout/context';

const Styles = createStyles((theme) => ({}));

const Centers = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.centers'));
  const [tD, , , tdLoading] = useTranslateLoader(prefixPN('addCenterDrawer'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { openDeleteConfirmationModal } = useLayout();

  const [store, render] = useStore({
    loading: true,
    selectedCenter: null,
  });

  const { classes: styles, cx } = Styles();

  async function load() {
    try {
      const [
        {
          data: { items: centers },
        },
        {
          langs: { locales },
        },
      ] = await Promise.all([
        listCentersRequest({
          page: 0,
          size: 999999,
        }),
        getLanguagesRequest(),
      ]);
      store.localesByCode = {};
      forEach(locales, ({ code, name }) => {
        store.localesByCode[code] = name;
      });
      store.centers = centers;
      store.loading = false;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  async function onSave(center) {
    const index = findIndex(store.centers, { id: center.id });
    if (index >= 0) {
      store.centers[index] = center;
    } else {
      store.centers.push(center);
    }
    store.selectedCenter = null;
    render();
  }

  function deleteCenter(center) {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        try {
          await removeCenterRequest(center.id);
          const index = findIndex(store.centers, { id: center.id });
          if (index >= 0) {
            store.centers.splice(index, 1);
          }
          render();
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
      },
    })();
  }

  React.useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      Header: tD('name'),
      accessor: 'name',
    },
    {
      Header: tD('preferredLanguage'),
      accessor: 'locale',
    },
    {
      Header: tD('timeZone'),
      accessor: 'timezone',
    },
    {
      Header: tD('email'),
      accessor: 'email',
    },
    {
      Header: t('actions'),
      accessor: 'actions',
    },
  ];

  return (
    <Box data-cypress-id="centersStep">
      <AddCenterDrawer
        opened={!!store.selectedCenter}
        center={store.selectedCenter}
        onSave={onSave}
        onClose={() => {
          store.selectedCenter = null;
          render();
        }}
      />
      <ContextContainer title={t('title')} description={t('description')} divided>
        {store.loading ? (
          <Loader />
        ) : store.centers?.length ? (
          <ContextContainer divided>
            <ContextContainer>
              {!tdLoading && !tLoading ? (
                <Table
                  data={map(store.centers, (center) => ({
                    ...center,
                    locale: store.localesByCode[center.locale],
                    actions: (
                      <Box style={{ textAlign: 'right', width: '100%' }}>
                        <ActionButton
                          onClick={() => {
                            store.selectedCenter = center;
                            render();
                          }}
                          tooltip={t('edit')}
                          icon={<EditIcon />}
                        />
                        <ActionButton
                          onClick={() => deleteCenter(center)}
                          tooltip={t('remove')}
                          icon={<DeleteBinIcon />}
                        />
                      </Box>
                    ),
                  }))}
                  columns={columns}
                />
              ) : null}
              <Box>
                <Button
                  leftIcon={<AddCircleIcon />}
                  variant="light"
                  onClick={() => {
                    store.selectedCenter = {};
                    render();
                  }}
                >
                  {t('noCentersYetButton')}
                </Button>
              </Box>
            </ContextContainer>

            <Stack justifyContent="end">
              <Button onClick={onNext} loading={store.saving}>
                {onNextLabel}
              </Button>
            </Stack>
          </ContextContainer>
        ) : (
          <Box>
            <Stack alignItems="center" justifyContent="center">
              <ImageLoader src="/public/admin/no-centers.png" height={460} width={537} />
              <ContextContainer>
                <Box>
                  <Title>{t('noCentersYet')}</Title>
                  <Paragraph>{t('noCentersYetDescription')}</Paragraph>
                </Box>
                <Box>
                  <Button
                    onClick={() => {
                      store.selectedCenter = {};
                      render();
                    }}
                  >
                    {t('noCentersYetButton')}
                  </Button>
                </Box>
              </ContextContainer>
            </Stack>
          </Box>
        )}
      </ContextContainer>
    </Box>
  );
};

Centers.defaultProps = {
  onNextLabel: 'Save and continue',
};
Centers.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Centers };
export default Centers;
