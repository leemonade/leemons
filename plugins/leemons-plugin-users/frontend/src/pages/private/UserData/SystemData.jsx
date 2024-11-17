import React, { useMemo } from 'react';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import {
  Box,
  Button,
  Checkbox,
  ContextContainer,
  Paper,
  Paragraph,
  Stack,
  Table,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  getSystemDataFieldsConfigRequest,
  saveSystemDataFieldsConfigRequest,
} from '../../../request';

const SystemDataTable1 = ['email', 'password', 'name', 'surname', 'birthday'];

function SystemData({ t, getErrorMessage }) {
  const [store, render] = useStore({
    secondSurname: { required: false, disabled: false },
    avatar: { required: false, disabled: false },
  });

  async function init() {
    const { config } = await getSystemDataFieldsConfigRequest();
    store.avatar = config.avatar;
    store.secondSurname = config.secondSurname;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  const table = useMemo(
    () => ({
      c1: [
        {
          Header: t('systemData.table.name'),
          accessor: 'name',
          className: 'text-left',
        },
        {
          Header: t('systemData.table.description'),
          accessor: 'description',
          className: 'text-left',
        },
        {
          Header: t('systemData.table.type'),
          accessor: 'type',
          className: 'text-left',
        },
      ],
      c1Data: map(SystemDataTable1, (item) => ({
        name: t(`systemData.tableItems.${item}.name`),
        description: t(`systemData.tableItems.${item}.description`),
        type: t(`systemData.tableItems.${item}.type`),
      })),
      c2: [
        {
          Header: t('systemData.table.name'),
          accessor: 'name',
          className: 'text-left',
        },
        {
          Header: t('systemData.table.description'),
          accessor: 'description',
          className: 'text-left',
        },
        {
          Header: t('systemData.table.type'),
          accessor: 'type',
          className: 'text-left',
        },
        {
          Header: t('systemData.table.actions'),
          accessor: 'actions',
          className: 'text-left',
        },
      ],
      c2Data: [
        {
          name: t(`systemData.tableItems.surname2.name`),
          description: t(`systemData.tableItems.surname2.description`),
          type: t(`systemData.tableItems.surname2.type`),
          actions: (
            <Box>
              <Checkbox
                label={t('systemData.table.makeMandatory')}
                disabled={store.secondSurname.disabled}
                checked={store.secondSurname.disabled ? false : store.secondSurname.required}
                onChange={() => {
                  store.secondSurname.required = !store.secondSurname.required;
                  render();
                }}
              />
              <Checkbox
                label={t('systemData.table.disableField')}
                checked={store.secondSurname.disabled}
                onChange={() => {
                  store.secondSurname.disabled = !store.secondSurname.disabled;
                  render();
                }}
              />
            </Box>
          ),
        },
        {
          name: t(`systemData.tableItems.avatar.name`),
          description: t(`systemData.tableItems.avatar.description`),
          type: t(`systemData.tableItems.avatar.type`),
          actions: (
            <Box>
              <Checkbox
                label={t('systemData.table.makeMandatory')}
                disabled={store.avatar.disabled}
                checked={store.avatar.disabled ? false : store.avatar.required}
                onChange={() => {
                  store.avatar.required = !store.avatar.required;
                  render();
                }}
              />
              <Checkbox
                label={t('systemData.table.disableField')}
                checked={store.avatar.disabled}
                onChange={() => {
                  store.avatar.disabled = !store.avatar.disabled;
                  render();
                }}
              />
            </Box>
          ),
        },
      ],
    }),
    [t, JSON.stringify(store)]
  );

  async function save() {
    store.loading = true;
    render();
    try {
      await saveSystemDataFieldsConfigRequest({
        avatar: store.avatar,
        secondSurname: store.secondSurname,
      });
      addSuccessAlert(t('systemData.saveSuccess'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  return (
    <ContextContainer
      sx={(theme) => ({ paddingTop: theme.spacing[4], paddingBottom: theme.spacing[4] })}
    >
      <Paragraph>{t('systemData.description1')}</Paragraph>
      <Paper>
        <Table columns={table.c1} data={table.c1Data} />
      </Paper>
      <Paragraph>{t('systemData.description2')}</Paragraph>
      <Paper>
        <Table columns={table.c2} data={table.c2Data} />
      </Paper>
      <Stack fullWidth justifyContent="right">
        <Button onClick={save} loading={store.loading}>
          {t('systemData.save')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

SystemData.propTypes = {
  t: PropTypes.func,
  getErrorMessage: PropTypes.func,
};

export { SystemData };
