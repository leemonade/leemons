import React from 'react';
import PropTypes from 'prop-types';
import { CheckBoxGroup } from '@bubbles-ui/components';

export function CurriculumFieldsPicker({ curriculumFields, onChange, value }) {
  const data = React.useMemo(
    () => curriculumFields.map((cField) => ({
      label: cField.name,
      value: cField.id,
      checked: value?.includes(cField.id),
    })),
    [curriculumFields, value]
  );

  return <CheckBoxGroup data={data} checked={value} onChange={onChange} direction="column" />;
}
CurriculumFieldsPicker.propTypes = {
  curriculumFields: PropTypes.arrayOf({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};
