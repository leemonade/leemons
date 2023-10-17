/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  Loader,
  Stack,
  Table,
} from '@bubbles-ui/components';
import { AddCircleIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import _, { findIndex } from 'lodash';
import { listProfilesRequest } from '@users/request';
import { addErrorAlert } from '@layout/alert';
import AddProfileDrawer from '@admin/pages/private/Setup/components/AddProfileDrawer';

const Profiles = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.profiles'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { openDeleteConfirmationModal } = useLayout();

  const [store, render] = useStore({
    loading: true,
    selectedCenter: null,
  });

  const tableHeaders = React.useMemo(
    () => [
      {
        Header: t('name'),
        accessor: 'name',
      },
      {
        Header: t('overview'),
        accessor: 'description',
      },
      {
        Header: <Box style={{ textAlign: 'right' }}>{t('actions')}</Box>,
        accessor: 'actions',
      },
    ],
    [t]
  );

  const tableItems = React.useMemo(
    () =>
      _.map(store.profiles, (item) => ({
        ...item,
        actions: (
          <Box style={{ textAlign: 'right', width: '100%' }}>
            <ActionButton
              onClick={() => {
                store.selectedProfile = null;
                render();
                setTimeout(() => {
                  store.selectedProfile = item;
                  render();
                }, 50);
              }}
              tooltip={t('view')}
              icon={<ViewOnIcon />}
            />
          </Box>
        ),
      })),
    [t, JSON.stringify(store.profiles)]
  );

  const load = async () => {
    try {
      store.loading = true;
      render();
      const {
        data: { items },
      } = await listProfilesRequest({
        page: 0,
        size: 99999,
      });

      store.profiles = items;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  };

  async function onSave({ profile }) {
    const index = findIndex(store.profiles, { id: profile.id });
    if (index >= 0) {
      store.profiles[index] = profile;
    } else {
      store.profiles.push(profile);
    }
    store.selectedProfile = null;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      {store.selectedProfile ? (
        <AddProfileDrawer
          opened={!!store.selectedProfile}
          profile={store.selectedProfile}
          onSave={onSave}
          onClose={() => {
            store.selectedProfile = null;
            render();
          }}
        />
      ) : null}

      <ContextContainer title={t('title')} description={t('description')} divided>
        {store.loading ? (
          <Loader />
        ) : (
          <>
            <ContextContainer subtitle={t('profileList')}>
              <Table columns={tableHeaders} data={tableItems} />
              <Box>
                <Button
                  leftIcon={<AddCircleIcon />}
                  variant="light"
                  onClick={() => {
                    store.selectedProfile = null;
                    render();
                    setTimeout(() => {
                      store.selectedProfile = {};
                      render();
                    }, 50);
                  }}
                >
                  {t('addProfile')}
                </Button>
              </Box>
            </ContextContainer>
            <Stack justifyContent="end">
              <Button onClick={onNext} loading={store.saving}>
                {onNextLabel}
              </Button>
            </Stack>
          </>
        )}
      </ContextContainer>
    </Box>
  );
};
Profiles.defaultProps = {
  onNextLabel: 'Save and continue',
};
Profiles.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Profiles };
export default Profiles;
