import React from 'react';
import PropTypes from 'prop-types';
import { getScaleLabel } from '@grades/helpers/getScaleLabel';
import { Text } from '@bubbles-ui/components';
import useGrade from './hooks/useGrade';

export default function Grade({ evaluation, value }) {
  const grade = useGrade(evaluation, value);

  if (grade) {
    return <Text>{getScaleLabel(grade)}</Text>;
  }
  return <Text>-</Text>;
}

Grade.propTypes = {
  evaluation: PropTypes.string,
  value: PropTypes.string,
};
