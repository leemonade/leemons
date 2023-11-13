import React, { useState, useEffect } from 'react';
import { AvatarSubject, Box, Text, TextClamp } from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { SubjectItemDisplayStyles } from './SubjectItemDisplay.styles';
import { useSubjects } from '../../hooks';
import {
  SUBJECTITEMSDISPLAY_DEFAULT_PROPS,
  SUBJECTITEMSDISPLAY_PROP_TYPES,
} from './SubjectItemDisplay.constants';
import { getMultiSubjectData } from '../../helpers/getMultiSubjectData';

const SubjectItemDisplay = ({ subjectsIds }) => {
  const [subjectData, setSubjectData] = useState(null);
  const { classes } = SubjectItemDisplayStyles();
  const labelsMultiSubject = {
    subjectName: 'Multiasignatura',
    groupName: 'Multiasignatura',
    name: 'Multiasignatura',
  };
  const preparedSubject = useSubjects(subjectsIds, {
    enabled: Array.isArray(subjectsIds) && subjectsIds?.length === 1,
  });
  const isMultiSubjectCase = isArray(subjectsIds) && subjectsIds.length > 1;
  useEffect(() => {
    if (isMultiSubjectCase) {
      const isMultisubject = getMultiSubjectData(labelsMultiSubject);
      setSubjectData(isMultisubject);
    } else if (
      isArray(subjectsIds) &&
      subjectsIds.length === 1 &&
      typeof subjectsIds[0] === 'string'
    ) {
      setSubjectData(preparedSubject.data[0]);
    }
    if (!isArray(subjectsIds)) setSubjectData(subjectsIds);
  }, []);
  return (
    <Box className={classes.root}>
      <AvatarSubject
        color={subjectData?.color || 'aquamarine'}
        size={'md'}
        isMultiSubject={isMultiSubjectCase}
        icon={subjectData?.icon}
      />
      <TextClamp lines={1}>
        <Text className={classes.text}>{subjectData?.name}</Text>
      </TextClamp>
    </Box>
  );
};
SubjectItemDisplay.propTypes = SUBJECTITEMSDISPLAY_PROP_TYPES;
SubjectItemDisplay.defaultProps = SUBJECTITEMSDISPLAY_DEFAULT_PROPS;
SubjectItemDisplay.displayName = 'SubjectItemDisplay';

export default SubjectItemDisplay;
export { SubjectItemDisplay };
