import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { listProfilesRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import update from 'immutability-helper';
import { Table } from 'leemons-ui';
import DatasetItemDrawerContext from './DatasetItemDrawerContext';

export const DatasetItemDrawerPermissions = ({ onChange = () => {} }) => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [profileError, setError, ProfileErrorAlert] = useRequestErrorMessage();
  const { t, item } = useContext(DatasetItemDrawerContext);
  const tableHeaders = useMemo(
    () => [
      {
        Header: t('profile'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('view'),
        accessor: 'view',
      },
      {
        Header: t('edit'),
        accessor: 'edit',
      },
    ],
    []
  );

  useEffect(() => {
    // ES: Cada vez que se modifique algo de los permisos lo comunicamos arriba
    onChange(
      _.map(profiles, (profile) => {
        return {
          id: profile.id,
          roles: profile.roles,
          view: profile.view.checked,
          edit: profile.edit.checked,
        };
      })
    );
  }, [profiles]);

  const getProfiles = async () => {
    try {
      // ES: Sacamos listado de perfiles
      const { data } = await listProfilesRequest({
        page: 0,
        size: 99999,
        withRoles: { columns: ['id'] },
      });
      // ES: Si estamos editando un item nos viene la variable item o si ya hemos cambiado algun permiso
      let itemProfilesById = {};
      if (item && item.frontConfig) {
        itemProfilesById = _.keyBy(item.frontConfig.permissions, 'id');
      }
      // ES: Seteamos los perfiles con las opciones que hubiera guardadas si no habia dejamos a false
      setProfiles(
        _.map(data.items, (profile) => {
          profile.view = {
            type: 'checkbox',
            checked: itemProfilesById[profile.id]?.view || false,
          };
          profile.edit = {
            type: 'checkbox',
            checked: itemProfilesById[profile.id]?.edit || false,
          };
          return profile;
        })
      );
    } catch (e) {
      setError(e);
    }
  };

  function onChangeData(event) {
    if (event.changedField === 'view') {
      if (event.newData[event.itemIndex].edit.checked) {
        setTimeout(() => {
          setProfiles(
            update(event.newData, {
              [event.itemIndex]: {
                view: { checked: { $set: true } },
              },
            })
          );
        }, 10);
      }
    }
    if (event.changedField === 'edit') {
      if (event.newItem.checked) {
        setProfiles(
          update(event.newData, {
            [event.itemIndex]: {
              view: { checked: { $set: true } },
            },
          })
        );
      }
    }
  }

  useEffect(() => {
    (async () => {
      await getProfiles();
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <ProfileErrorAlert />
      {profiles && !profileError ? (
        <Table
          columns={tableHeaders}
          data={profiles}
          setData={setProfiles}
          onChangeData={onChangeData}
        />
      ) : null}
    </>
  );
};
