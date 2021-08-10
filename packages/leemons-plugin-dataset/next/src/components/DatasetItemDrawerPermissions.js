import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { listProfilesRequest } from '@users/request';
import useRequestErrorMessage from '@users/helpers/useRequestErrorMessage';
import update from 'immutability-helper';
import { Table } from 'leemons-ui';

export const DatasetItemDrawerPermissions = ({ t, item }) => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [profileError, setError, ProfileErrorAlert] = useRequestErrorMessage();
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

  const getProfiles = async () => {
    try {
      const { data } = await listProfilesRequest({
        page: 0,
        size: 99999,
        withRoles: { columns: ['id'] },
      });
      setProfiles(
        _.map(data.items, (profile) => {
          profile.view = {
            type: 'checkbox',
            checked: false,
          };
          profile.edit = {
            type: 'checkbox',
            checked: false,
          };
          return profile;
        })
      );
    } catch (e) {
      console.info(e);
      setError(e);
    }
  };

  function onChangeData(event) {
    if (event.changedField === 'edit') {
      if (event.newItem.checked) {
        setProfiles(
          update(profiles, {
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
