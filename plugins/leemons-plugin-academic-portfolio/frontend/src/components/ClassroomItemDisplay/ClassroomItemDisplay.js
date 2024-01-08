import React, { useEffect, useState } from 'react';
import { AvatarSubject, Box, Text, TextClamp } from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { useClassroomsData } from '@academic-portfolio/hooks/useClassroomsData';
import { ClassroomItemDisplayStyles } from './ClassroomItemDisplay.styles';
import {
  CLASSROOMTITEMSDISPLAY_DEFAULT_PROPS,
  CLASSROOMTITEMSDISPLAY_PROP_TYPES,
} from './ClassroomItemDisplay.constants';
import { ClassroomItemDisplaySkeleton } from './ClassroomItemDisplaySkeleton';

const ClassroomItemDisplay = ({ classroomIds, compact, showSubject }) => {
  const [programNames, setProgramNames] = useState(null);
  const { classes } = ClassroomItemDisplayStyles({ compact });
  const { data: classData, isLoading } = useClassroomsData(classroomIds);

  const handleCourses = (data) => {
    let allCoursesStrigyfied = '';
    if (isArray(data) && data.length === 1) {
      return setProgramNames(`Grupo ${data[0]?.name}`);
    }
    if (isArray(data)) {
      data.forEach((course, index) => {
        allCoursesStrigyfied += `${course?.name}${index < data.length - 1 ? ',' : ''}`;
      });
    }
    if (!allCoursesStrigyfied) {
      return setProgramNames('');
    }
    return setProgramNames(`Grupos (${allCoursesStrigyfied})`);
  };
  const isMultiSubjectCase = classData?.isMultiSubject;
  useEffect(() => {
    if (classData) {
      handleCourses(classData?.courses);
    }
  }, [classData?.courses, programNames]);

  if (isLoading || !classData)
    return (
      <Box className={classes.root}>
        <ClassroomItemDisplaySkeleton />
      </Box>
    );
  if (!showSubject && !isMultiSubjectCase) return null;

  return (
    <Box className={classes.root}>
      <AvatarSubject
        color={classData?.color}
        size={'md'}
        isMultiSubject={isMultiSubjectCase}
        icon={classData?.icon ?? undefined}
      />
      <Box className={classes.textWrapper}>
        <TextClamp lines={1}>
          <Text color={compact ? 'primary' : 'muted'} role="productive" size="xs">
            {classData?.subjectName}
            {!!compact && ` - ${classData?.groupName} ${programNames}`}
          </Text>
        </TextClamp>
        {!compact && (
          <TextClamp lines={1}>
            <Text className={classes.programName}>{`${classData?.groupName} ${programNames}`}</Text>
          </TextClamp>
        )}
      </Box>
    </Box>
  );
};
ClassroomItemDisplay.defaultProps = CLASSROOMTITEMSDISPLAY_DEFAULT_PROPS;
ClassroomItemDisplay.propTypes = CLASSROOMTITEMSDISPLAY_PROP_TYPES;

export default ClassroomItemDisplay;
export { ClassroomItemDisplay };
