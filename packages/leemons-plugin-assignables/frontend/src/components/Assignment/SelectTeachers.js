import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { searchUserAgentsRequest } from '@users/request';
import _ from 'lodash';
import { getProfiles } from '../../request/profiles';

function Actions({ id, onDelete }) {
  return (
    <>
      <DeleteBinIcon onClick={() => typeof onDelete === 'function' && onDelete(id)} />
    </>
  );
}

Actions.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default function SelectTeachers({ role, onChange }) {
  const [profiles, setProfiles] = useState([null]);
  const { setValue, getValues } = useForm();

  // EN: Get the teacher profile selected on the plugin settings
  // ES: Obtenemos el perfil de profesor seleccionado en la configuración del plugin
  useEffect(() => {
    getProfiles(role).then((p) => {
      if (p.length) {
        setProfiles(p.map(({ profile: id }) => id));
      }
    });
  }, [role]);

  useEffect(() => {
    (async () => {
      const response = await searchUserAgentsRequest(
        { profile: profiles },
        {
          withCenter: true,
          withProfile: true,
        }
      );

      const ids = response.userAgents?.map(({ id }) => id);
      const currentValue = getValues('assignee');
      if (!_.isEqual(currentValue, ids)) {
        onChange(ids);
        setValue('assignee', []);
      }
    })();
  }, [profiles]);

  return <></>;
}

SelectTeachers.propTypes = {
  role: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
