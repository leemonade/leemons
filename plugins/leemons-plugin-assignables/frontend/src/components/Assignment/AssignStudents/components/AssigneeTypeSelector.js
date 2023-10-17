import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RadioGroup } from '@bubbles-ui/components';

export default function AssigneeTypeSelector({ labels, onChange, value }) {
  const options = useMemo(
    () => [
      {
        value: 'class',
        label: labels?.assignTo?.class,
      },
      {
        value: 'customGroups',
        label: labels?.assignTo?.customGroups,
      },
      // {
      //   value: 'session',
      //   label: labels?.assignTo?.session,
      // },
    ],
    [labels]
  );

  return <RadioGroup data={options} onChange={onChange} value={value} />;
}

AssigneeTypeSelector.propTypes = {
  labels: PropTypes.shape({
    assignTo: PropTypes.shape({
      class: PropTypes.string,
      customGroups: PropTypes.string,
      session: PropTypes.string,
    }).isRequired,
  }),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.func,
};
