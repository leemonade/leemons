import React, { useEffect, useState } from 'react';
import { listProfilesRequest } from '@users/request';
import useRequestErrorMessage from '@users/helpers/useRequestErrorMessage';

export const DatasetItemDrawerPermissions = ({ t }) => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [profileError, setError, ProfileErrorAlert] = useRequestErrorMessage();

  const getProfiles = async () => {
    try {
      const { data } = await listProfilesRequest({
        page: 0,
        size: 99999,
        withRoles: { columns: ['id'] },
      });
      console.log(data.items);
      setProfiles(data.items);
    } catch (e) {
      console.info(e);
      setError(e);
    }
  };

  useEffect(() => {
    (async () => {
      await getProfiles();
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <ProfileErrorAlert />
    </>
  );
};
