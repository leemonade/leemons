import React from 'react';
import PropTypes from 'prop-types';
import SelectUserAgent from '@users/components/SelectUserAgent';

export default function SelectCustomGroup({ labels, profiles, onChange, value }) {
  // TODO: Mostrar solo los que están matriculados en las asignaturas
  return (
    <>
      <SelectUserAgent
        maxSelectedValues={0}
        onChange={onChange}
        value={value}
        profiles={profiles}
      />
    </>
  );
}

SelectCustomGroup.propTypes = {
  labels: PropTypes.shape({}).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};
