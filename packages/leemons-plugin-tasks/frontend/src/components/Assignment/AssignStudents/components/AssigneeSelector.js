import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';
import { getProfiles } from '../../../../request/profiles';
import SelectClass from './SelectClass';
import SelectCustomGroup from './SelectCustomGroup';

export default function AssigneeSelector({ labels, profile, onChange, value }) {
  const { control } = useFormContext();
  const [profiles, setProfiles] = useState(null);

  const type = useWatch({
    control,
    name: 'type',
  });

  useEffect(async () => {
    const p = await getProfiles(profile);
    setProfiles([p[0].profile]);
  }, []);

  if (!profiles) {
    return null;
  }

  switch (type) {
    case 'class':
      return <SelectClass labels={labels} profiles={profiles} value={value} onChange={onChange} />;
    case 'customGroups':
      return (
        <SelectCustomGroup labels={labels} profiles={profiles} value={value} onChange={onChange} />
      );
    case 'session':
      return <p>Session</p>;
    default:
      return null;
  }
}

AssigneeSelector.propTypes = {
  labels: PropTypes.shape({}).isRequired,
  profile: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
};
