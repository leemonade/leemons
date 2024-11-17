/* eslint-disable no-param-reassign */
import React, { useContext, useEffect, useState } from 'react';
import { keyBy, map } from 'lodash';
import { Box, Table, Title } from '@bubbles-ui/components';
import { DatasetItemDrawerContext } from '../context/DatasetItemDrawerContext';

const CONFIG_PERMISSIONS_KEY = 'config.permissions';

const Permissions = () => {
  const [data, setData] = useState([]);

  const {
    contextRef: { messages, profiles },
    form: { setValue, getValues, watch },
  } = useContext(DatasetItemDrawerContext);

  const configPermissionsValue = watch(CONFIG_PERMISSIONS_KEY);

  const tableHeaders = [
    {
      Header: messages.permissionsProfileLabel,
      accessor: 'name',
      className: 'text-left',
    },
    {
      Header: messages.permissionsViewLabel,
      accessor: 'view',
      className: 'text-center',
    },
    {
      Header: messages.permissionsEditLabel,
      accessor: 'edit',
      className: 'text-center',
    },
  ];

  useEffect(() => {
    // ES: Cada vez que se modifique algo de los permisos lo comunicamos arriba
    setValue(
      CONFIG_PERMISSIONS_KEY,
      map(data, (profile) => ({
        id: profile.id,
        roles: profile.roles,
        view: profile.view.checked,
        edit: profile.edit.checked,
      }))
    );
  }, [data]);

  function onChangeData(event) {
    if (event.changedField === 'view' && event.newData[event.itemIndex].edit.checked) {
      event.newData[event.itemIndex].view.checked = true;
    }
    if (event.changedField === 'edit' && event.newItem.checked) {
      event.newData[event.itemIndex].view.checked = true;
    }
    setData(event.newData);
  }

  useEffect(() => {
    const itemProfilesById = keyBy(getValues(CONFIG_PERMISSIONS_KEY), 'id');
    // ES: Seteamos los perfiles con las opciones que hubiera guardadas si no habia dejamos a false
    const newData = map(profiles, (profile) => ({
      ...profile,
      view: {
        type: 'checkbox',
        checked: itemProfilesById[profile.id]?.view || false,
      },
      edit: {
        type: 'checkbox',
        checked: itemProfilesById[profile.id]?.edit || false,
      },
    }));
    if (JSON.stringify(data) !== JSON.stringify(newData)) {
      setData(newData);
    }
  }, [profiles, JSON.stringify(configPermissionsValue)]);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[5] })}>
      <Title order={4}>{messages.fieldPermissionsTitle}</Title>
      <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
        <Table columns={tableHeaders} data={data} onChangeData={onChangeData} />
      </Box>
    </Box>
  );
};

export { Permissions };
