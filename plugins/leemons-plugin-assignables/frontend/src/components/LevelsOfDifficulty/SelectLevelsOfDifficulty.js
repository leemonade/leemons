import React from 'react';
import { Select } from '@bubbles-ui/components';
import useLevelsOfDifficulty from './hooks/useLevelsOfDifficulty';

export default function SelectLevelsOfDifficulty(props) {
  const levels = useLevelsOfDifficulty();
  return <Select {...props} data={levels} dropdownPosition="flip" />;
}
