import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { listProfilesRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import update from 'immutability-helper';
import { Table } from 'leemons-ui';
import {
  DatasetItemDrawerContext,
  DatasetItemDrawerProfilesContext,
} from './DatasetItemDrawerContext';
import { useAsync } from '@common/useAsync';

export const DatasetItemDrawerPermissions = ({ onChange = () => {} }) => {
  const [loading, setLoading] = useState(true);
  const [profileError, setError, ProfileErrorAlert] = useRequestErrorMessage();
  const { t, item } = useContext(DatasetItemDrawerContext);
  const { setState: setStateProfiles, profiles } = useContext(DatasetItemDrawerProfilesContext);
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
    [t]
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

  function onChangeData(event) {
    if (event.changedField === 'view') {
      if (event.newData[event.itemIndex].edit.checked) {
        setTimeout(() => {
          setStateProfiles({
            profiles: update(event.newData, {
              [event.itemIndex]: {
                view: { checked: { $set: true } },
              },
            }),
          });
        }, 10);
      }
    }
    if (event.changedField === 'edit') {
      if (event.newItem.checked) {
        setStateProfiles({
          profiles: update(event.newData, {
            [event.itemIndex]: {
              view: { checked: { $set: true } },
            },
          }),
        });
      }
    }
  }

  const setProfiles = (data) => {
    setStateProfiles({ profiles: data });
  };

  const load = useMemo(
    () => () =>
      listProfilesRequest({
        page: 0,
        size: 99999,
        withRoles: { columns: ['id'] },
      }),
    []
  );

  const onSuccess = useMemo(
    () => ({ data }) => {
      // ES: Si estamos editando un item nos viene la variable item o si ya hemos cambiado algun permiso
      let itemProfilesById = {};
      if (item && item.frontConfig) {
        itemProfilesById = _.keyBy(item.frontConfig.permissions, 'id');
      }
      // ES: Seteamos los perfiles con las opciones que hubiera guardadas si no habia dejamos a false
      setStateProfiles({
        profiles: _.map(data.items, (profile) => {
          profile.view = {
            type: 'checkbox',
            checked: itemProfilesById[profile.id]?.view || false,
          };
          profile.edit = {
            type: 'checkbox',
            checked: itemProfilesById[profile.id]?.edit || false,
          };
          return profile;
        }),
      });
      setLoading(false);
    },
    []
  );

  const onError = useMemo(
    () => (e) => {
      setError(e);
    },
    []
  );

  useAsync(load, onSuccess, onError);

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
