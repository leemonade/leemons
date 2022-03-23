import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { ContextContainer } from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
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
  const { control, setValue } = useForm();

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
    setValue('assignee', []);
  }, [profiles]);

  return (
    <ContextContainer direction="row" alignItems="center" spacing={1}>
      <Controller
        name="assignee"
        control={control}
        render={({ field }) => (
          <SelectUserAgent
            {...field}
            // TRANSLATE: Teacher label
            label="Teachers"
            onChange={(v) => {
              field.onChange(v);
              onChange(v);
            }}
            maxSelectedValues={0}
            profiles={profiles}
          />
        )}
      />
    </ContextContainer>
  );
}

SelectTeachers.propTypes = {
  role: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
