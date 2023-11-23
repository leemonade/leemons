import React, { useState, useEffect } from 'react';
import { AvatarSubject, Box, Text, TextClamp } from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { useClassroomsData } from '@academic-portfolio/hooks/useClassroomsData';
import { ClassroomItemDisplayStyles } from './ClassroomItemDisplay.styles';
import {
  CLASSROOMTITEMSDISPLAY_DEFAULT_PROPS,
  CLASSROOMTITEMSDISPLAY_PROP_TYPES,
} from './ClassroomItemDisplay.constants';

const ClassroomItemDisplay = ({ classroomIds }) => {
  const [programNames, setProgramNames] = useState(null);
  const { classes } = ClassroomItemDisplayStyles();
  const { data: classData } = useClassroomsData(classroomIds);
  // const labelsMultiSubject = {
  //   subjectName: 'Multiasignatura',
  //   groupName: 'Multiasignatura',
  //   name: 'Multiasignatura',
  // };

  const handleCourses = (data) => {
    let allCoursesStrigyfied = '';
    if (isArray(data)) {
      data.forEach((course) => {
        allCoursesStrigyfied += `${course?.name},`;
      });
    }
    return setProgramNames(allCoursesStrigyfied);
  };

  useEffect(() => {
    if (classData) {
      handleCourses(classData?.courses);
    }
  }, [classData?.courses, programNames]);

  return (
    <Box className={classes.root}>
      {classData && (
        <AvatarSubject
          color={classData?.color}
          size={'md'}
          // isMultiSubject={isMultiSubjectCase}
          icon={classData?.icon ?? undefined}
        />
      )}
      <Box className={classes.textWrapper}>
        <TextClamp lines={1}>
          <Text color="muted" role="productive" size="xs">
            {classData?.subjectName}
          </Text>
        </TextClamp>
        <TextClamp lines={1}>
          <Text className={classes.programName}>{`${programNames}${classData?.groupName}`}</Text>
        </TextClamp>
      </Box>
    </Box>
  );
};
ClassroomItemDisplay.propTypes = CLASSROOMTITEMSDISPLAY_PROP_TYPES;
ClassroomItemDisplay.defaultProps = CLASSROOMTITEMSDISPLAY_DEFAULT_PROPS;
ClassroomItemDisplay.displayName = 'ClassroomItemDisplay';

export default ClassroomItemDisplay;
export { ClassroomItemDisplay };
