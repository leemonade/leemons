import React, { useEffect, useState, useRef } from 'react';
// import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { Box, Text, Popover } from '@bubbles-ui/components';
// import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { AlertWarningTriangleIcon, CheckIcon } from '@bubbles-ui/icons/solid';
import { ChevronDownIcon } from '@bubbles-ui/icons/outline';
// import useTranslateLoader from '@multilanguage/useTranslateLoader';
// import prefixPN from '../../helpers/prefixPN';
import {
  CLASSROOM_PICKER_DEFAULT_PROPS,
  CLASSROOM_PICKER_PROP_TYPES,
} from './ClassroomPicker.constants';
import { ClassroomPickerItem } from './components/ClassroomPickerItem';
import { ClassroomPickerList } from '../ClassroomPickerList';
import { ClassroomPickerStyles } from './ClassroomPicker.styles';

const ClassroomPicker = ({ programId, data, allowCollisions = false }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [contentWidth, setContentWidth] = useState('auto');
  const [isOpen, setIsOpen] = useState(false);
  const [hasCollisions, setHasCollisions] = useState(false);
  const [collisionError, setCollisionError] = useState(false);
  const { classes } = ClassroomPickerStyles({ contentWidth, isOpen }, { name: 'ClassroomPicker' });
  const targetRef = useRef(null);
  const contentRef = useRef(null);

  // const [t] = useTranslateLoader(prefixPN('classroomPicker'));
  // const { data: classesData } = useProgramClasses(programId, { enabled: !!programId });

  useEffect(() => {
    const adjustContentWidth = () => {
      if (targetRef.current) {
        const width = `${targetRef.current.offsetWidth}px`;
        setContentWidth(width);
      }
    };
    adjustContentWidth();
    window.addEventListener('resize', adjustContentWidth);
    return () => window.removeEventListener('resize', adjustContentWidth);
  }, []);

  function convertTimeToMinutes(time) {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function checkCollision(schedule1, schedule2) {
    const dayMatch = schedule1.day === schedule2.day;
    const start1 = convertTimeToMinutes(schedule1.start);
    const end1 = convertTimeToMinutes(schedule1.end);
    const start2 = convertTimeToMinutes(schedule2.start);
    const end2 = convertTimeToMinutes(schedule2.end);
    const timeOverlap = start1 < end2 && end1 > start2;

    return dayMatch && timeOverlap;
  }

  const handleTransformData = (dataClasses) =>
    dataClasses.map((item, index, array) => {
      const allDays = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];
      const dayAbbreviations = {
        // cambiar valores a variables de texto
        monday: 'Mo',
        tuesday: 'Tu',
        wednesday: 'We',
        thursday: 'Th',
        friday: 'Fr',
        saturday: 'Sa',
        sunday: 'Su',
      };
      const scheduleMap = item.schedule.reduce((acc, { day, start, end }) => {
        const key = `${start}-${end}`;
        if (!acc[key]) {
          acc[key] = [day];
        } else {
          acc[key].push(day);
        }
        return acc;
      }, {});

      const collideWith = array.reduce((acc, currentItem, currentIndex) => {
        if (index !== currentIndex) {
          item.schedule.forEach((itemSchedule) => {
            currentItem.schedule.forEach((currentItemSchedule) => {
              if (checkCollision(itemSchedule, currentItemSchedule)) {
                setHasCollisions(true);
                acc.push(currentItem.id);
              }
            });
          });
        }
        return acc;
      }, []);

      const scheduleArray = Object.entries(scheduleMap).map(([key, days]) => {
        const [start, end] = key.split('-');
        const sortedDays = days.sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));
        const daysAbbreviated = sortedDays.map((day) => dayAbbreviations[day]);

        let daysStr = '';
        let lastDayIndex = -2;
        let tempArray = [];

        daysAbbreviated.forEach((day, index) => {
          const currentIndex = allDays.indexOf(sortedDays[index]);
          if (lastDayIndex + 1 === currentIndex) {
            tempArray.push(day);
          } else {
            if (tempArray.length > 1) {
              daysStr += `${tempArray[0]} - ${tempArray[tempArray.length - 1]}, `;
            } else if (tempArray.length === 1) {
              daysStr += `${tempArray[0]}, `;
            }
            tempArray = [day];
          }
          lastDayIndex = currentIndex;
        });

        if (tempArray.length > 1) {
          daysStr += `${tempArray[0]} - ${tempArray[tempArray.length - 1]}`;
        } else if (tempArray.length === 1) {
          daysStr += `${tempArray[0]}`;
        }

        daysStr = daysStr.endsWith(', ') ? daysStr.slice(0, -2) : daysStr;

        return `${daysStr}, ${start}-${end}`;
      });

      return {
        value: item?.id,
        label: item?.subject?.name,
        subjectName: item?.subject?.name,
        subjectColor: item?.subject?.color,
        subjectIcon: item?.subject?.icon,
        schedule: scheduleArray,
        collideWith,
      };
    });

  useEffect(() => {
    if (subjectsList.some((item) => item.collideWith.length > 0)) {
      setCollisionError(true);
    } else {
      setCollisionError(false);
    }
  }, [subjectsList]);

  useEffect(() => {
    const transformedData = handleTransformData(data);
    setSubjects(transformedData);
  }, [data]);

  const handleSelectSubject = (subject) => {
    setSubjectsList((prevState) => [...prevState, subject]);
    setSubjects((prevState) => prevState.filter((item) => item.value !== subject.value));
  };
  const handleSelectAllSubjects = () => {
    setSubjectsList((prevState) => [...prevState, ...subjects]);
    setSubjects([]);
  };
  const handleRemoveSubjectFromList = (subject) => {
    setSubjects((prevState) => [...prevState, subject]);
    setSubjectsList((prevState) => prevState.filter((item) => item.value !== subject.value));
  };

  return (
    <Box>
      <Popover
        target={
          <Box ref={targetRef} className={classes.popoverButton}>
            <Text className={classes.popoverButtonText}>
              {subjects.length > 0 ? 'Select subject ' : 'No more subjects available'}
            </Text>
            <ChevronDownIcon height={12} width={12} className={classes.chevronIcon} />
          </Box>
        }
        closeOnEscape
        disabled={subjects.length === 0}
        shadow="none"
        withinPortal
        closeOnClickOutside
        onChange={() => setIsOpen(!isOpen)}
      >
        <Box ref={contentRef} className={classes.popoverContent}>
          {!allowCollisions && collisionError && (
            <Box className={classes.collisionContainer}>
              <AlertWarningTriangleIcon className={classes.collisionIcon} />
              <Text className={classes.collisionLabel}>{`Some subjects are not compatible`}</Text>
            </Box>
          )}
          {!hasCollisions && subjects?.length > 1 ? (
            <Box className={classes.allSubjectsContainer} onClick={() => handleSelectAllSubjects()}>
              <Box className={classes.allSubjectsCircle}>
                <CheckIcon width={12} height={12} />
              </Box>
              <Text
                className={classes.allSubjectsLabel}
              >{`All Subjects (${subjects?.length})`}</Text>
            </Box>
          ) : null}
          {subjects.map((subject) => {
            const collisionDetected =
              !allowCollisions &&
              hasCollisions &&
              subjectsList.some((listItem) => subject?.collideWith?.includes(listItem.value));
            return (
              <Box
                key={subject.value}
                onClick={() => !collisionDetected && handleSelectSubject(subject)}
              >
                <ClassroomPickerItem {...subject} isCollisionDetected={collisionDetected} />
              </Box>
            );
          })}
        </Box>
      </Popover>
      <ClassroomPickerList subjects={subjectsList} onRemove={handleRemoveSubjectFromList} />
    </Box>
  );
};

ClassroomPicker.defaultProps = CLASSROOM_PICKER_DEFAULT_PROPS;
ClassroomPicker.propTypes = CLASSROOM_PICKER_PROP_TYPES;

export { ClassroomPicker };
